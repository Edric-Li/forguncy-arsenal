using Newtonsoft.Json;

namespace Arsenal.Server.Model;

public class ListItemModel
{
    [JsonProperty("name")] public string Name { get; init; }

    [JsonProperty("size")] public long? Size { get; init; }

    [JsonProperty("creationTime")] public long CreationTime { get; init; }

    [JsonProperty("lastWriteTime")] public long LastWriteTime { get; init; }

    [JsonProperty("isFolder")] public bool IsFolder { get; init; }
}