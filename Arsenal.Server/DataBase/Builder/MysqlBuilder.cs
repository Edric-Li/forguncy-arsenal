using MySql.Data.MySqlClient;

namespace Arsenal.Server.DataBase.Builder;

public class MysqlBuilder : IBuilder
{
    private MySqlConnection _connection;

    public async Task InitializeAsync(string connectionString)
    {
        _connection = new MySqlConnection(connectionString);

        await _connection.OpenAsync();

        try
        {
            await ExecuteSql(GetCreateFileHashesTableSql());
            await ExecuteSql(GetCreateFilesTableSql());
            await ExecuteSql(GetCreateTemporaryDownloadFilesTableSql());

            await EnsureIndexExistsAsync(null, Constants.FileHashesTableName, "ix_arsenal_file_hashes_hash",
                "hash");
            await EnsureIndexExistsAsync(null, Constants.FilesTableName, "ix_arsenal_files_key", "key");
            await EnsureIndexExistsAsync(null, Constants.TemporaryDownloadFiles,
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

    private async Task ExecuteSql(string sql)
    {
        await using var command = new MySqlCommand(sql, _connection);
        await command.ExecuteNonQueryAsync();
    }

    private async Task<bool> IndexExistsAsync(string dataBaseName, string tableName, string indexName)
    {
        await using var command =
            new MySqlCommand($"SHOW INDEX FROM {dataBaseName}.{tableName} WHERE Key_name = '{indexName}'", _connection);
        await using var reader = await command.ExecuteReaderAsync();
        return await reader.ReadAsync();
    }

    private async Task EnsureIndexExistsAsync(string dataBaseName, string tableName, string indexName,
        string columnName)
    {
        try
        {
            if (await IndexExistsAsync(dataBaseName, tableName, indexName))
            {
                return;
            }

            await ExecuteSql(GenerateCreateIndexQuery(dataBaseName, tableName, indexName, columnName));
        }
        catch (Exception e)
        {
            Console.WriteLine($"An error occurred: {e.Message}");
        }
    }

    private static string GenerateCreateIndexQuery(string databaseName, string tableName, string indexName,
        string columnName)
    {
        return $"CREATE INDEX {indexName} ON {databaseName}.{tableName} ({columnName});";
    }

    private string GetCreateFileHashesTableSql()
    {
        return
            "CREATE TABLE IF NOT EXISTS arsenal_file_hashes (id INT AUTO_INCREMENT PRIMARY KEY,hash TEXT NOT NULL,path TEXT NOT NULL\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    }

    private string GetCreateFilesTableSql()
    {
        return
            "CREATE TABLE IF NOT EXISTS arsenal_files (id INT AUTO_INCREMENT PRIMARY KEY, `key` VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, hash VARCHAR(255), folder_path VARCHAR(255) NOT NULL, content_type VARCHAR(255) NOT NULL, ext INT NOT NULL, size INT NOT NULL DEFAULT 0, uploader VARCHAR(255) NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    }

    private string GetCreateTemporaryDownloadFilesTableSql()
    {
        return
            "CREATE TABLE IF NOT EXISTS temporary_download_files (id INT AUTO_INCREMENT PRIMARY KEY,`key` TEXT NOT NULL,path TEXT NOT NULL,has_copy TINYINT NOT NULL DEFAULT 0,expiration_at INT NOT NULL DEFAULT 60) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    }
}
