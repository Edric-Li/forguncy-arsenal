using System.Diagnostics;
using Arsenal.Server.Common;
using Arsenal.Server.DataBase.Builder;
using Arsenal.Server.DataBase.Models;
using GrapeCity.Forguncy.ServerApi;
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
    public static string SqliteFilePath { get; set; } = string.Empty;

    /// <summary>
    /// 活字格对于数据库的访问
    /// </summary>
    public static IDataAccess DataAccess { get; set; }

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
    /// 初始化（初始化表信息）sd
    /// </summary>
    private static async Task InitAsync()
    {
        Debugger.Launch();
        InitializeDatabaseConnectionString();

        if (!string.IsNullOrWhiteSpace(Configuration.Configuration.PluginConfig.DatabaseConnectionName))
        {
            var connectionString =
                DataAccess.GetConnectionStringByID(Configuration.Configuration.PluginConfig.DatabaseConnectionName);
            await new MysqlBuilder().InitializeAsync(connectionString);
        }
        else
        {
            await new SqliteBuilder().InitializeAsync(Configuration.Configuration.DatabaseConnectionString);

            if (!Configuration.Configuration.RunAtLocal)
            {
                await MergeDatabaseAsync();
            }
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
        var filePath = string.IsNullOrWhiteSpace(SqliteFilePath) ? GetDatabaseFilePath() : SqliteFilePath;

        var dir = Path.GetDirectoryName(filePath);
        if (!Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir!);
        }

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
