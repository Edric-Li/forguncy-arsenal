namespace Arsenal.Server.Model;

public class DownloadLinkEntity
{
    /// <summary>
    /// 文件路径
    /// </summary>
    public string FilePath { get; set; }

    /// <summary>
    /// 过期时间
    /// </summary>
    public long ExpiresAt { get; set; }
}