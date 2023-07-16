using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ClientCommandOrderWeight.DownloadFileCommand)]
public class DownloadFileCommand : Command
{
    [DisplayName("附件值")]
    [JsonProperty("fileKeys")]
    [FormulaProperty]
    [Required]
    public object FileKeys { get; set; }

    public override string ToString()
    {
        return "下载文件";
    }
}