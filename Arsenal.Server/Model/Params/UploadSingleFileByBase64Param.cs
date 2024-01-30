using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class UploadSingleFileByBase64Param
{
    /// <summary>
    /// Base64字符串
    /// </summary>
    [JsonProperty("base64")]
    public string Base64 { get; set; }


    /// <summary>
    /// 文件名
    /// </summary>
    [JsonProperty("fileName")]
    public string FileName { get; set; }
}
