using Arsenal.Server.Model.Params;

namespace Arsenal.Server.Model;

public class FileMetaData
{
    /// <summary>
    /// 文件名称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 文件Hash
    /// </summary>
    public string Hash { get; set; }

    /// <summary>
    /// 所在目录
    /// </summary>
    public string FolderPath { get; set; }

    /// <summary>
    /// 文件类型
    /// </summary>
    public string ContentType { get; set; }

    /// <summary>
    /// 文件扩展名
    /// </summary>
    public string Ext { get; set; }

    /// <summary>
    /// 文件大小
    /// </summary>
    public long Size { get; set; }

    /// <summary>
    /// 上传者
    /// </summary>
    public string Uploader { get; set; }

    /// <summary>
    /// 冲突策略
    /// </summary>
    public ConflictStrategy ConflictStrategy { get; set; }
}