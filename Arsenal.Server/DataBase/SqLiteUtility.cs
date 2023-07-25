using Microsoft.Data.Sqlite;
using System.Diagnostics;

namespace Arsenal.Server.DataBase;

/// <summary>
/// Sqlite数据库工具类
/// </summary>
public class SqLiteUtility
{
    /// <summary>
    /// 数据库连接字符串
    /// </summary>
    private static string ConnectionString => Configuration.Configuration.DatabaseConnectionString;

    /// <summary>
    /// 确保表存在
    /// </summary>
    /// <param name="tableName">表名</param>
    /// <param name="columns">列信息</param>
    public static async Task EnsureTableExistsAsync(string tableName, params string[] columns)
    {
        try
        {
            await using (var connection = new SqliteConnection(ConnectionString))
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

    /// <summary>
    /// 表是否存在
    /// </summary>
    /// <param name="connection"></param>
    /// <param name="tableName"></param>
    /// <returns></returns>
    private static async Task<bool> TableExistsAsync(SqliteConnection connection, string tableName)
    {
        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=@TableName";
        command.Parameters.AddWithValue("@TableName", tableName);

        var count = Convert.ToInt32(await command.ExecuteScalarAsync());
        return count > 0;
    }

    /// <summary>
    /// 生成创建表的SQL语句
    /// </summary>
    /// <param name="tableName"></param>
    /// <param name="columns"></param>
    /// <returns></returns>
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

    /// <summary>
    /// 确保索引存在
    /// </summary>
    /// <param name="tableName"></param>
    /// <param name="indexName"></param>
    /// <param name="columnName"></param>
    public async Task EnsureIndexExistsAsync(string tableName, string indexName, string columnName)
    {
        try
        {
            await using (var connection = new SqliteConnection(ConnectionString))
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

    /// <summary>
    /// 索引是否存在
    /// </summary>
    /// <param name="connection"></param>
    /// <param name="indexName"></param>
    /// <returns></returns>
    private static bool IndexExists(SqliteConnection connection, string indexName)
    {
        using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name=@IndexName";
        command.Parameters.AddWithValue("@IndexName", indexName);

        var count = Convert.ToInt32(command.ExecuteScalar());
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
}