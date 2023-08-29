using System.Diagnostics;
using Arsenal.Server.Common;
using Arsenal.Server.DataBase.Models;
using Microsoft.EntityFrameworkCore;
using File = System.IO.File;

namespace Arsenal.Server.DataBase;

/// <summary>
/// 数据库初始化器
/// </summary>
public class DatabaseInitializer
{
    /// <summary>
    /// 是否已经初始化
    /// </summary>
    private bool _isInitialized;

    /// <summary>
    /// 懒加载实例
    /// </summary>
    private static readonly Lazy<DatabaseInitializer> LazyInstance = new(() => new DatabaseInitializer());

    /// <summary>
    /// 实例属性
    /// </summary>
    public static DatabaseInitializer Instance => LazyInstance.Value;

    /// <summary>
    /// 数据库链接串
    /// </summary>
    public static string DatabaseFilePath { get; set; } = string.Empty;

    /// <summary>
    /// 确保初始化
    /// </summary>
    public void EnsureInitialization()
    {
        if (_isInitialized)
        {
            return;
        }

        _isInitialized = true;

        _ = InitAsync();
    }

    /// <summary>
    /// 初始化（初始化表信息）
    /// </summary>
    private static async Task InitAsync()
    {
        InitializeDatabaseConnectionString();

        var sqLiteUtility = new SqLiteUtility();

        await SqLiteUtility.EnsureTableExistsAsync(Constants.FileHashesTableName,
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "hash TEXT NOT NULL",
            "path TEXT NOT NULL"
        );

        await SqLiteUtility.EnsureTableExistsAsync(Constants.FilesTableName,
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "key TEXT NOT NULL",
            "name TEXT NOT NULL",
            "hash TEXT",
            "folder_path TEXT NOT NULL",
            "content_type  TEXT NOT NULL",
            "ext INT NOT NULL",
            "size int(11) NOT NULL DEFAULT '0'",
            "uploader TEXT NOT NULL",
            "created_at int(11) NOT NULL DEFAULT '0'"
        );

        await SqLiteUtility.EnsureTableExistsAsync(Constants.TemporaryDownloadFiles,
            "id INTEGER PRIMARY KEY AUTOINCREMENT",
            "key TEXT NOT NULL",
            "path TEXT NOT NULL",
            "has_copy int(1) NOT NULL DEFAULT '0'",
            "expiration_at int(11) NOT NULL DEFAULT '60'"
        );

        await sqLiteUtility.EnsureIndexExistsAsync(Constants.FileHashesTableName, "ix_arsenal_file_hashes_hash",
            "hash");

        await sqLiteUtility.EnsureIndexExistsAsync(Constants.FilesTableName, "ix_arsenal_files_key", "key");
        await sqLiteUtility.EnsureIndexExistsAsync(Constants.TemporaryDownloadFiles,
            "ix_arsenal_temporary_download_files_key", "key");

        if (!Configuration.Configuration.RunAtLocal)
        {
            await MergeDatabaseAsync();
        }
    }

    public static string GetDatabaseFilePath()
    {
        var dbFileName = "db";

        if (Configuration.Configuration.RunAtLocal)
        {
            var unixTimestampStr = DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();

            var files = Directory.GetFiles(Configuration.Configuration.DataFolderPath);

            if (files.Length > 0)
            {
                long maxLongValue = 0;

                foreach (var item in files)
                {
                    if (!item.EndsWith(".sqlite3"))
                    {
                        continue;
                    }

                    var value = item.Replace(".sqlite3", "");

                    if (long.TryParse(Path.GetFileName(value), out var longValue))
                    {
                        if (longValue > maxLongValue)
                        {
                            maxLongValue = longValue;
                        }
                    }
                }

                if (maxLongValue != 0)
                {
                    unixTimestampStr = maxLongValue.ToString();
                }
            }

            dbFileName = unixTimestampStr;
        }

        return Path.Combine(Configuration.Configuration.DataFolderPath, dbFileName + ".sqlite3");
    }

    /// <summary>
    /// 初始化数据库连接串
    /// 如果是在本地运行，那么就使用时间戳作为数据库文件名
    /// 否则就使用默认的db.sqlite3
    /// </summary>
    private static void InitializeDatabaseConnectionString()
    {
        var filePath = string.IsNullOrWhiteSpace(DatabaseFilePath) ? GetDatabaseFilePath() : DatabaseFilePath;

        Configuration.Configuration.DatabaseConnectionString =
            $"Data Source={filePath}";
    }


    private static async Task CleanupSqliteFileTask(string filePath, int retryTime = 0)
    {
        if (retryTime > 60)
        {
            Logger.Error("删除数据库文件失败，重试次数已达到上限。");
            return;
        }

        try
        {
            if (File.Exists(filePath + "-shm"))
            {
                File.Delete(filePath + "-shm");
            }

            if (File.Exists(filePath + "-wal"))
            {
                File.Delete(filePath + "-wal");
            }

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        catch (Exception e)
        {
            Logger.Error("删除数据库文件失败" + e.Message);
            await Task.Delay((retryTime + 1) * 1000);
            await CleanupSqliteFileTask(filePath, retryTime + 1);
        }
    }


    /// <summary>
    /// 数据库合并
    /// </summary>
    private static async Task MergeDatabaseAsync()
    {
        var files = Directory.GetFiles(Configuration.Configuration.DataFolderPath);

        if (files.Length < 1)
        {
            return;
        }

        var officialDatabaseContext = new DatabaseContext();

        try
        {
            foreach (var item in files)
            {
                if (!item.EndsWith(".sqlite3"))
                {
                    continue;
                }

                var value = item.Replace(".sqlite3", "");

                if (!long.TryParse(Path.GetFileName(value), out _))
                {
                    continue;
                }

                var dbContext = new DatabaseContext($"Data Source={item};pooling=false;");

                try
                {
                    var fileHashes = await dbContext.FileHashes.ToListAsync();
                    var fileEntities = await dbContext.Files.ToListAsync();

                    foreach (var fileHash in fileHashes)
                    {
                        if (await officialDatabaseContext.FileHashes.AnyAsync(x => x.Hash == fileHash.Hash))
                        {
                            continue;
                        }

                        await officialDatabaseContext.AddAsync(new FileHash()
                        {
                            Hash = fileHash.Hash,
                            Path = fileHash.Path
                        });
                    }

                    foreach (var file in fileEntities)
                    {
                        if (await officialDatabaseContext.Files.AnyAsync(x => x.Key == file.Key))
                        {
                            continue;
                        }

                        await officialDatabaseContext.Files.AddAsync(new Models.File()
                        {
                            Key = file.Key,
                            Name = file.Name,
                            Hash = file.Hash,
                            FolderPath = file.FolderPath,
                            ContentType = file.ContentType,
                            Ext = file.Ext,
                            Size = file.Size,
                            Uploader = file.Uploader,
                            CreatedAt = file.CreatedAt
                        });
                    }

                    await officialDatabaseContext.SaveChangesAsync();
                }
                finally
                {
                    await dbContext.DisposeAsync();

                    _ = CleanupSqliteFileTask(item);
                }
            }
        }
        catch (Exception e)
        {
            Trace.WriteLine(e.Message);
        }
        finally
        {
            _ = officialDatabaseContext.DisposeAsync();
        }
    }
}