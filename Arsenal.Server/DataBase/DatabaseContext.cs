using Arsenal.Server.DataBase.Models;
using Microsoft.EntityFrameworkCore;
using File = Arsenal.Server.DataBase.Models.File;

namespace Arsenal.Server.DataBase;

public class DatabaseContext : DbContext
{
    private readonly string _connectionString;

    public DbSet<File> Files { get; set; }

    public DbSet<FileHash> FileHashes { get; set; }

    public DbSet<TemporaryDownloadFile> TemporaryDownloadFiles { get; set; }

    public DatabaseContext()
    {
        _connectionString = Configuration.Configuration.DatabaseConnectionString;
    }

    public DatabaseContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite(_connectionString);
}