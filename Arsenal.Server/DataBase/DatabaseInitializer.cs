using Microsoft.EntityFrameworkCore;
using File = System.IO.File;

namespace Arsenal.Server.DataBase;

public class DatabaseInitializer
{
    private bool _isInitialized;

    private static readonly Lazy<DatabaseInitializer> LazyInstance = new(() => new DatabaseInitializer());

    public static DatabaseInitializer Instance => LazyInstance.Value;

    /// <summary>
    /// 初始化数据库连接串
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

    public void EnsureInitialization()
    {
        if (_isInitialized)
        {
            return;
        }

        _isInitialized = true;

        _ = InitAsync();
    }

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

        await sqLiteUtility.EnsureIndexExistsAsync(Constants.FileHashesTableName, "ix_arsenal_file_hashes_hash",
            "hash");

        await sqLiteUtility.EnsureIndexExistsAsync(Constants.FilesTableName, "ix_arsenal_files_key", "key");

        await MergeDatabaseAsync();
    }

    /// <summary>
    /// 数据库合并
    /// </summary>
    private static async Task MergeDatabaseAsync()
    {
        var directories = Directory.GetDirectories(Configuration.Configuration.DataFolderPath);

        if (directories.Length < 1)
        {
            return;
        }

        var officialDatabaseContext = new DatabaseContext();

        foreach (var item in directories)
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

            var dbContext = new DatabaseContext($"Data Source={item}");

            try
            {
                var fileHashes = await dbContext.FileHashes.ToListAsync();
                var files = await dbContext.Files.ToListAsync();

                foreach (var fileHash in fileHashes)
                {
                    if (await officialDatabaseContext.FileHashes.AnyAsync(x => x.Hash == fileHash.Hash))
                    {
                        continue;
                    }

                    await officialDatabaseContext.AddAsync(fileHash);
                }

                foreach (var file in files)
                {
                    await officialDatabaseContext.Files.AddAsync(file);
                }

                await officialDatabaseContext.SaveChangesAsync();

                File.Delete(item);
            }
            finally
            {
                _ = dbContext.DisposeAsync();
            }
        }
    }
}