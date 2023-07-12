using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class InitMultipartUploadParam
{
    [JsonProperty("fileMd5")] public string FileMd5 { get; set; }
    
    [JsonProperty("targetFolderPath")] public string TargetFolderPath { get; set; }
    
    [JsonProperty("fileName")]
    public string FileName { get; set; }

    [JsonProperty("conflictStrategy")]
    public ConflictStrategy? ConflictStrategy { get; set; }
}