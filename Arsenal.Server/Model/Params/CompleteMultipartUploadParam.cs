using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class CompleteMultipartUploadParam
{
    [JsonProperty("uploadId")]
    public string UploadId { get; set; }
}

public enum ConflictStrategy
{
    Overwrite,
    Rename,
    Reject,
}