using System.ComponentModel;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ClientCommandOrderWeight.DownloadFileCommand)]
public class DownloadFileCommand : Command
{
    [DisplayName("文件名称")]
    [JsonProperty("fileName")]
    [FormulaProperty]
    public object FileName { get; set; }

    public override string ToString()
    {
        return "下载文件";
    }
}