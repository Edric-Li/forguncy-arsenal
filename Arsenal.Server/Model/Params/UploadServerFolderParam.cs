namespace Arsenal.Server.Model.Params;

public class UploadServerFolderParam
{
    /// <summary>
    /// 文件名称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 文件夹路径
    /// </summary>
    public string FolderPath { get; set; }

    /// <summary>
    /// 文件大小
    /// </summary>
    public long Size { get; set; }

    /// <summary>
    /// 文件扩展名
    /// </summary>
    public string Ext { get; set; }
}