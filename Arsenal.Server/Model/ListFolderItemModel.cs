using Newtonsoft.Json;

namespace Arsenal.Server.Model;

public class ListFolderItemModel
{
    /// <summary>
    /// 名称
    /// </summary>
    [JsonProperty("name")]
    public string Name { get; init; }

    /// <summary>
    /// 文件夹大小
    /// </summary>
    [JsonProperty("size")]
    public long? Size { get; set; }
}