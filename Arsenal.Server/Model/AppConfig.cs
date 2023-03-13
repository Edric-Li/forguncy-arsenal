namespace Arsenal.Server.Model;

public class AppConfig
{
    // 在服务器上存储的目录
    public string LocalUploadFolderPath { get; set; }
    
    // 在云上存储的目录
    public string CloudStorageUploadFolderPath { get; set; }
    
    // 存储类型
    public string StorageType { get; set; }
}