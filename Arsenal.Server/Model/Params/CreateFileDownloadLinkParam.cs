using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class CreateFileDownloadLinkParam
{
    /// <summary>
    /// 文件路径
    /// </summary>
    [JsonProperty("filePath")]
    public string FilePath { get; set; }

    /// <summary>
    /// 有效期
    /// 可以设置此属性来指定下载链接的有效期限。如果将过期时间设置为 0，则表示下载链接永不过期。
    /// </summary>
    [JsonProperty("expirationDate")]
    public int ExpirationDate { get; set; }

    /// <summary>
    /// 创建副本
    /// 创建副本后，即使原始文件被删除或移动，您仍然可以使用该下载链接下载文件。
    /// </summary>
    [JsonProperty("createCopy")]
    public bool CreateCopy { get; set; }
}