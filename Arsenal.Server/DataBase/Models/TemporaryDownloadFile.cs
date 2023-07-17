using System.ComponentModel.DataAnnotations.Schema;

namespace Arsenal.Server.DataBase.Models;

[Table(Constants.TemporaryDownloadFiles)]
public class TemporaryDownloadFile
{
    /// <summary>
    /// 没什么用的ID
    /// </summary>
    [Column("id")]
    public int Id { get; set; }

    /// <summary>
    /// 文件的hash值 
    /// </summary>
    [Column("key")]
    public string Key { get; set; }

    /// <summary>
    /// 文件的路径
    /// </summary>
    [Column("path")]
    public string Path { get; set; }

    /// <summary>
    /// 是否有副本文件
    /// </summary>
    [Column("has_copy")]
    public bool HasCopy { get; set; }

    /// <summary>
    /// 过期时间
    /// </summary>
    [Column("expiration_at")]
    public long ExpirationAt { get; set; }
}