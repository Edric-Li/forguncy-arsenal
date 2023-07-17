using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class InitMultipartUploadParam
{
    /// <summary>
    /// 文件名称
    /// </summary>
    [JsonProperty("name")]
    public string Name { get; set; }

    /// <summary>
    /// 文件的Hash
    /// </summary>
    [JsonProperty("hash")]
    public string Hash { get; set; }

    /// <summary>
    /// 文件类型
    /// </summary>
    [JsonProperty("contentType")]
    public string ContentType { get; set; }

    /// <summary>
    /// 文件大小
    /// </summary>
    [JsonProperty("size")]
    public int Size { get; set; }

    /// <summary>
    /// 文件夹路径
    /// </summary>
    [JsonProperty("folderPath")]
    public string FolderPath { get; set; }

    /// <summary>
    /// 冲突策略
    /// </summary>
    [JsonProperty("conflictStrategy")]
    public ConflictStrategy? ConflictStrategy { get; set; }
}