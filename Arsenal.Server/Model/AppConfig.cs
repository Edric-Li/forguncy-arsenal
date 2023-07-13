namespace Arsenal.Server.Model;

public class AppConfig
{
    /// <summary>
    /// 应用路径
    /// </summary>
    public string RootPath { get; set; }

    /// <summary>
    /// 在服务器上存储的目录
    /// </summary>
    public string LocalUploadFolderPath { get; set; }

    /// <summary>
    /// 在云上存储的目录
    /// </summary>
    public string CloudStorageUploadFolderPath { get; set; }

    /// <summary>
    /// 存储类型
    /// </summary>
    public string StorageType { get; set; }

    /// <summary>
    /// 是否使用云存储
    /// </summary>
    public bool UseCloudStorage { get; set; }

    /// <summary>
    /// 是否使用公网URL
    /// </summary>
    public bool UsePublicUrl { get; set; }

    /// <summary>
    /// UserService的URL
    /// </summary>
    public string UserServiceUrl { get; set; }
}