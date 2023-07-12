using System.ComponentModel;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight(3)]
public class GetFileAccessUrlCommand : Command
{
    [DisplayName("文件名称")]
    [JsonProperty("fileName")]
    [FormulaProperty]
    public object FileName { get; set; }

    [DisplayName("结果至变量")]
    [JsonProperty("result")]
    [ResultToProperty]
    public string Result { get; set; }

    public override string ToString()
    {
        return "获取文件访问链接";
    }
}