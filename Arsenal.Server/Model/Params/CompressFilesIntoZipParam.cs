﻿using Newtonsoft.Json;

namespace Arsenal.Server.Model.Params;

public class CompressFilesIntoZipParam
{
    /// <summary>
    /// 文件ID列表
    /// </summary>
    [JsonProperty("fileIds")]
    public string[] FileIds { get; set; }

    /// <summary>
    /// 压缩包名称
    /// </summary>
    [JsonProperty("zipName")]
    public string ZipName { get; set; }

    /// <summary>
    /// 保持文件夹结构
    /// </summary>
    [JsonProperty("needKeepFolderStructure")]
    public bool NeedKeepFolderStructure { get; set; }
}