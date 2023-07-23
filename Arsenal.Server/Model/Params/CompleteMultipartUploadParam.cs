﻿using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class CompleteMultipartUploadParam
{
    /// <summary>
    /// 上传ID
    /// </summary>
    [JsonProperty("uploadId")]
    public string UploadId { get; set; }
}