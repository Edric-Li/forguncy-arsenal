using Newtonsoft.Json;

namespace Arsenal.Server.Model.Result;

public class ListItemsResult
{
    /// <summary>
    /// 文件信息
    /// </summary>
    [JsonProperty("files")]
    public List<ListFileItemModel> Files { get; init; } = new();

    /// <summary>
    /// 文件夹信息
    /// </summary>
    [JsonProperty("folders")]
    public List<ListFolderItemModel> Folders { get; init; } = new();
}