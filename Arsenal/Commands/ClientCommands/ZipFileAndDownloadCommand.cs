﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ClientCommandOrderWeight.ZipFileAndDownload)]
public class ZipFileAndDownloadCommand : Command
{
    [DisplayName("文件名称")]
    [FormulaProperty]
    [Required]
    [JsonProperty("fileNames")]
    public object FileNames { get; set; }

    [DisplayName("下载文件名")]
    [FormulaProperty]
    [Required]
    [JsonProperty("downloadFileName")]
    public object DownloadFileName { get; set; } = "arsenal.zip";

    [DisplayName("在压缩文件中保持文件夹结构")]
    [JsonProperty("needKeepFolderStructure")]
    [DefaultValue(true)]
    public bool NeedKeepFolderStructure { get; set; } = true;

    public override string ToString()
    {
        return "将文件打包成压缩包并下载";
    }
}