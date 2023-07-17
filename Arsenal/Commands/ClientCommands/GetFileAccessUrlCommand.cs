using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ClientCommandOrderWeight.GetFileAccessUrlCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/get-file-access-link.png")]

public class GetFileAccessUrlCommand : Command
{
    [DisplayName("附件值")]
    [JsonProperty("fileKeys")]
    [FormulaProperty]
    [Required]
    public object FileKeys { get; set; }

    [DisplayName("结果至变量")]
    [JsonProperty("result")]
    [ResultToProperty]
    public string Result { get; set; }

    public override string ToString()
    {
        return "获取文件访问链接";
    }
}