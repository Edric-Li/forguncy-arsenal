using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class CreateSoftLinkParam
{
    [JsonProperty("uploadId")]
    public string UploadId { get; set; }
    
    [JsonProperty("fileName")]
    public string FileName { get; set; }
}