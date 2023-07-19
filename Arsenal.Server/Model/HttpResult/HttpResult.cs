using Newtonsoft.Json;

namespace Arsenal.Server.Model.HttpResult;

public abstract class HttpResult
{
    /// <summary>
    /// API调用结果
    /// </summary>
    [JsonProperty("result")] 
    public bool Result { get; set; }

    /// <summary>
    /// API调用返回的消息
    /// </summary>
    [JsonProperty("message")]
    public string Message { get; set; }

    /// <summary>
    /// API调用返回的数据
    /// </summary>
    [JsonProperty("data")]
    public object Data { get; set; }
}