using System.Diagnostics;
using Microsoft.Data.Sqlite;

namespace Arsenal.Server.DataBase.Builder;

public class SqliteBuilder : IBuilder
{
    private SqliteConnection _connection;

    public async Task InitializeAsync(string connectionString)
    {
        _connection = new SqliteConnection(connectionString);
        await _connection.OpenAsync();

        try
        {
            await ExecuteSqlAsync(GetCreateFileHashesTableSql());
            await ExecuteSqlAsync(GetCreateFilesTableSql());
            await ExecuteSqlAsync(GetCreateTemporaryDownloadFilesTableSql());

            await EnsureIndexExistsAsync(Constants.FileHashesTableName, "ix_arsenal_file_hashes_hash",
                "hash");
            await EnsureIndexExistsAsync(Constants.FilesTableName, "ix_arsenal_files_key", "key");
            await EnsureIndexExistsAsync(Constants.TemporaryDownloadFiles,
                "ix_arsenal_temporary_download_files_key", "key");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        finally
        {
            await _connection.CloseAsync();
        }
    }

    private async Task ExecuteSqlAsync(string sql)
    {
        await using var command = _connection.CreateCommand();
        command.CommandText = sql;

        await command.ExecuteNonQueryAsync();
    }

    /// <summary>
    /// 确保索引存在
    /// </summary>
    /// <param name="tableName"></param>
    /// <param name="indexName"></param>
    /// <param name="columnName"></param>
    private async Task EnsureIndexExistsAsync(string tableName, string indexName, string columnName)
    {
        try
        {
            if (await IndexExistsAsync(indexName))
            {
                return;
            }

            await ExecuteSqlAsync(GenerateCreateIndexQuery(tableName, indexName, columnName));

            Console.WriteLine("Index created successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }

    /// <summary>
    /// 索引是否存在
    /// </summary>
    /// <param name="indexName"></param>
    /// <returns></returns>
    private async Task<bool> IndexExistsAsync(string indexName)
    {
        await using var command = _connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name=@IndexName";
        command.Parameters.AddWithValue("@IndexName", indexName);

        var count = Convert.ToInt32(await command.ExecuteScalarAsync());
        return count > 0;
    }

    /// <summary>
    /// 获取创建索引的SQL语句
    /// </summary>
    /// <param name="tableName"></param>
    /// <param name="indexName"></param>
    /// <param name="columnName"></param>
    /// <returns></returns>
    private static string GenerateCreateIndexQuery(string tableName, string indexName, string columnName)
    {
        return $"CREATE INDEX IF NOT EXISTS {indexName} ON {tableName} ({columnName})";
    }

    /// <summary>
    /// 获取创建文件哈希表的SQL语句
    /// </summary>
    /// <returns></returns>
    private static string GetCreateFileHashesTableSql()
    {
        return
            "CREATE TABLE IF NOT EXISTS arsenal_file_hashes (id INTEGER PRIMARY KEY AUTOINCREMENT, hash TEXT NOT NULL, path TEXT NOT NULL\n);";
    }

    /// <summary>
    /// 获取创建文件表的SQL语句
    /// </summary>
    /// <returns></returns>
    private static string GetCreateFilesTableSql()
    {
        return
            "CREATE TABLE IF NOT EXISTS arsenal_files (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, name TEXT NOT NULL, hash TEXT, folder_path TEXT NOT NULL, content_type TEXT NOT NULL, ext INT NOT NULL, size INT NOT NULL DEFAULT 0, uploader TEXT NOT NULL, created_at INT NOT NULL DEFAULT 0);";
    }

    /// <summary>
    /// 获取创建临时下载文件表的SQL语句
    /// </summary>
    /// <returns></returns>
    private static string GetCreateTemporaryDownloadFilesTableSql()
    {
        return
            "CREATE TABLE IF NOT EXISTS temporary_download_files (id INTEGER PRIMARY KEY AUTOINCREMENT,key TEXT NOT NULL,path TEXT NOT NULL,has_copy INT NOT NULL DEFAULT 0,expiration_at INT NOT NULL DEFAULT 60);";
    }
}
