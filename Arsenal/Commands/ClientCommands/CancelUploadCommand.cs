using System.ComponentModel;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ClientCommandOrderWeight.CancelUploadCommand)]
public class CancelUploadCommand : Command
{
    /// <summary>
    /// 唯一ID
    /// </summary>
    [JsonProperty("uid")]
    [FormulaProperty]
    [DisplayName("唯一ID")]
    public object Uid { get; set; }

    public override string ToString()
    {
        return "取消删除操作";
    }
}