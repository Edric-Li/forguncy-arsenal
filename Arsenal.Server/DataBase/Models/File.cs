using System.ComponentModel.DataAnnotations.Schema;

namespace Arsenal.Server.DataBase.Models;

[Table(Constants.FilesTableName)]
public class File
{
    /// <summary>
    /// 文件ID
    /// </summary>
    [Column("id")]
    public int Id { get; set; }

    /// <summary>
    /// 文件Key
    /// </summary>
    [Column("key")]
    public string Key { get; set; }

    /// <summary>
    /// 文件名称，其实在文件Key中已经包含了，但是为了查询方便，所以还是加了这个冗余字段
    /// </summary>
    [Column("name")]
    public string Name { get; set; }

    /// <summary>
    /// 文件的Hash
    /// </summary>
    [Column("hash")]
    public string Hash { get; set; }

    /// <summary>
    /// 文件所在目录
    /// </summary>
    [Column("folder_path")]
    public string FolderPath { get; set; }

    /// <summary>
    /// 文件类型
    /// </summary>
    [Column("content_type")]
    public string ContentType { get; set; }

    /// <summary>
    /// 文件扩展名，为了方便查询
    /// </summary>
    [Column("ext")]
    public string Ext { get; set; }

    /// <summary>
    /// 文件的大小
    /// </summary>
    [Column("size")]
    public long Size { get; set; }

    /// <summary>
    /// 文件上传者（用户名）
    /// </summary>
    [Column("uploader")]
    public string Uploader { get; set; }

    /// <summary>
    /// 创建时间
    /// </summary>
    [Column("created_at")]
    public long CreatedAt { get; set; }
}