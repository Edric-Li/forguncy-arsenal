using Newtonsoft.Json;

namespace Arsenal.Server.Model;

public class ListFileItemModel
{
    /// <summary>
    /// 文件名称
    /// </summary>
    [JsonProperty("name")]
    public string Name { get; init; }

    /// <summary>
    /// 文件类型
    /// </summary>
    [JsonProperty("contentType")]
    public string ContentType { get; init; }

    /// <summary>
    /// 文件大小
    /// </summary>
    [JsonProperty("size")]
    public long? Size { get; init; }

    /// <summary>
    /// 创建者
    /// </summary>
    [JsonProperty("uploader")]
    public string Uploader { get; init; }

    /// <summary>
    /// 创建时间
    /// </summary>
    [JsonProperty("createdAt")]
    public long CreatedAt { get; init; }
}