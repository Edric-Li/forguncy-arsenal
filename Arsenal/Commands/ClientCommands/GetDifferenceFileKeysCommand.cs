using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ClientCommandOrderWeight.GetDifferenceFileKeysCommand)]
[Description("多用于删除附件时，获取新旧附件值的差集，然后删除差集中的附件。")]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/calculation-of-differences.png")]
public class GetDifferenceFileKeysCommand : Command
{
    [DisplayName("旧附件值")]
    [JsonProperty("oldFileKeys")]
    [Required]
    [FormulaProperty]
    public object OldFileKeys { get; set; }

    [DisplayName("新附件值")]
    [JsonProperty("newFileKeys")]
    [FormulaProperty]
    [Required]
    public object NewFileKeys { get; set; }

    [DisplayName("结果至变量")]
    [JsonProperty("result")]
    [ResultToProperty]
    public string Result { get; set; }

    public override string ToString()
    {
        return "获取新旧附件值的差集";
    }
}