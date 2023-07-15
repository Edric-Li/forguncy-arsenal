using System.ComponentModel;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ClientCommandOrderWeight.GetFileAccessUrlCommand)]
public class GetFileAccessUrlCommand : Command
{
    [DisplayName("附件值")]
    [JsonProperty("fileKeys")]
    [FormulaProperty]
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