using Newtonsoft.Json;

namespace Arsenal.Common;

public class PluginConfig
{
    /// <summary>
    ///  唯一标识
    /// </summary>
    [JsonProperty("guid")]
    public string Guid { get; set; }
}