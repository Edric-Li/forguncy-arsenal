using Newtonsoft.Json;

namespace Arsenal.Server.Model.HttpResult;

public abstract class HttpResult
{
    [JsonProperty("result")] 
    public bool Result { get; set; }

    [JsonProperty("message")] public string Message { get; set; }

    [JsonProperty("data")] public object Data { get; set; }
}