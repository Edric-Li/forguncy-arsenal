using System.Diagnostics;
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
    
    /// <summary>
    /// 初始化数据库连接串
    /// 如果是在本地运行，那么就使用时间戳作为数据库文件名
    /// 否则就使用默认的db.sqlite3
    /// </summary>
    private static void InitializeDatabaseConnectionString()
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

        Configuration.Configuration.DatabaseConnectionString =
            $"Data Source={Path.Combine(Configuration.Configuration.DataFolderPath, dbFileName + ".sqlite3")}";
        
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
            var deletedSqliteFiles = new HashSet<string>();

            var deletedMarkFiles = files
                .Where(item => item.EndsWith(".deleted"))
                .ToArray();

            foreach (var item in deletedMarkFiles)
            {
                try
                {
                    var dbFilePath = item.Replace(".deleted", "");
                    File.Delete(item);
                    File.Delete(dbFilePath);
                    deletedSqliteFiles.Add(dbFilePath);
                }
                catch (Exception e)
                {
                    Trace.WriteLine(e);
                }
            }

            foreach (var item in files)
            {
                if (!item.EndsWith(".sqlite3"))
                {
                    continue;
                }

                if (deletedSqliteFiles.Contains(item))
                {
                    continue;
                }

                var value = item.Replace(".sqlite3", "");

                if (!long.TryParse(Path.GetFileName(value), out _))
                {
                    continue;
                }

                var dbContext = new DatabaseContext($"Data Source={item}");

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

                    // Sqlite 连接后，文件会被锁定，所以在这里不直接删除，而是创建一个 .deleted 文件，等待下次启动时删除
                    File.Create(item + ".deleted");
                }
                finally
                {
                    _ = dbContext.DisposeAsync();
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