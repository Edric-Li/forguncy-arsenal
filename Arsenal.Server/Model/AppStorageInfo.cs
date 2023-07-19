namespace Arsenal.Server.Model;

/// <summary>
/// 应用存储信息
/// </summary>
public class AppStorageInfo
{
    /// <summary>
    /// 存储类型
    /// </summary>
    public string StorageType { get; set; }

    /// <summary>
    /// 上传文件夹路径
    /// </summary>
    public string UploadFolderPath { get; set; }

    /// <summary>
    /// 是否使用公开URL
    /// </summary>
    public bool? UsePubicUrl { get; set; }
}