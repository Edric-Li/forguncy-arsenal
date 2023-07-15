using System.ComponentModel.DataAnnotations.Schema;

namespace Arsenal.Server.DataBase.Models;

[Table(Constants.FileHashesTableName)]
public class FileHash
{
    /// <summary>
    /// 没什么用的ID
    /// </summary>
    [Column("id")]
    public int Id { get; set; }

    /// <summary>
    /// 文件的hash值 
    /// </summary>
    [Column("hash")]
    public string Hash { get; set; }

    /// <summary>
    /// 文件的路径 
    /// </summary>
    [Column("path")]
    public string Path { get; set; }
}