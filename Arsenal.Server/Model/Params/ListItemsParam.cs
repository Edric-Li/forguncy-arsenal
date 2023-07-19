using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class ListItemsParam
{
    /// <summary>
    /// 相对路径
    /// </summary>
    [JsonProperty("relativePath")]
    public string RelativePath { get; set; }
}