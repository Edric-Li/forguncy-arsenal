using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class CreateSoftLinkParam
{
    [JsonProperty("uploadId")]
    public string UploadId { get; set; }
}