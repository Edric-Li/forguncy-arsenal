using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class ListItemsParam
{
    [JsonProperty("relativePath")] public string RelativePath { get; set; }
}