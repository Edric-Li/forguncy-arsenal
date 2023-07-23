using Arsenal.Server.DataBase.Models;
using Microsoft.EntityFrameworkCore;
using File = Arsenal.Server.DataBase.Models.File;

namespace Arsenal.Server.DataBase;

/// <summary>
/// 数据库上下文
/// </summary>
public class DatabaseContext : DbContext
{
    /// <summary>
    /// 连接字符串
    /// </summary>
    private readonly string _connectionString;

    /// <summary>
    /// 文件表
    /// </summary>
    public DbSet<File> Files { get; set; }

    /// <summary>
    /// 文件hash表
    /// </summary>
    public DbSet<FileHash> FileHashes { get; set; }

    /// <summary>
    /// 临时下载文件表
    /// </summary>
    public DbSet<TemporaryDownloadFile> TemporaryDownloadFiles { get; set; }

    /// <summary>
    /// 无参构造函数，使用默认的连接字符串
    /// </summary>
    public DatabaseContext()
    {
        _connectionString = Configuration.Configuration.DatabaseConnectionString;
    }

    /// <summary>
    /// 有参构造函数，使用指定的连接字符串
    /// </summary>
    /// <param name="connectionString"></param>
    public DatabaseContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    /// <summary>
    /// 配置数据库上下文
    /// </summary>
    /// <param name="options"></param>
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite(_connectionString);
}