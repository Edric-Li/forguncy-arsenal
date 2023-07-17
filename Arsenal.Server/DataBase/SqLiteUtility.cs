using System.Data.SQLite;
using System.Diagnostics;

namespace Arsenal.Server.DataBase;

public class SqLiteUtility
{
    private static string ConnectionString => Configuration.Configuration.DatabaseConnectionString;

    public static async Task EnsureTableExistsAsync(string tableName, params string[] columns)
    {
        try
        {
            await using (var connection = new SQLiteConnection(ConnectionString))
            {
                connection.Open();

                if (await TableExistsAsync(connection, tableName))
                {
                    Trace.WriteLine($"Table '{tableName}' already exists.");
                    return;
                }

                await using (var command = connection.CreateCommand())
                {
                    command.CommandText = GenerateCreateTableQuery(tableName, columns);
                    await command.ExecuteNonQueryAsync();
                }
            }

            Trace.WriteLine("Table created successfully.");
        }
        catch (Exception ex)
        {
            Trace.WriteLine($"An error occurred: {ex.Message}");
        }
    }

    private static async Task<bool> TableExistsAsync(SQLiteConnection connection, string tableName)
    {
        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=@TableName";
        command.Parameters.AddWithValue("@TableName", tableName);

        var count = Convert.ToInt32(await command.ExecuteScalarAsync());
        return count > 0;
    }

    private static string GenerateCreateTableQuery(string tableName, params string[] columns)
    {
        var createTableQuery = $"CREATE TABLE {tableName} (";

        for (var i = 0; i < columns.Length; i++)
        {
            createTableQuery += columns[i];
            if (i != columns.Length - 1)
            {
                createTableQuery += ",";
            }
        }

        createTableQuery += ")";

        return createTableQuery;
    }

    public async Task EnsureIndexExistsAsync(string tableName, string indexName, string columnName)
    {
        try
        {
            await using (var connection = new SQLiteConnection(ConnectionString))
            {
                connection.Open();

                // 检查索引是否已存在
                if (IndexExists(connection, indexName))
                {
                    Console.WriteLine($"Index '{indexName}' already exists.");
                    return;
                }

                await using (var command = connection.CreateCommand())
                {
                    command.CommandText = GenerateCreateIndexQuery(tableName, indexName, columnName);
                    await command.ExecuteNonQueryAsync();
                }
            }

            Console.WriteLine("Index created successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }

    private static bool IndexExists(SQLiteConnection connection, string indexName)
    {
        using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name=@IndexName";
        command.Parameters.AddWithValue("@IndexName", indexName);

        var count = Convert.ToInt32(command.ExecuteScalar());
        return count > 0;
    }

    private static string GenerateCreateIndexQuery(string tableName, string indexName, string columnName)
    {
        return $"CREATE INDEX IF NOT EXISTS {indexName} ON {tableName} ({columnName})";
    }
}