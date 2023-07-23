using System.ComponentModel;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理")]
[OrderWeight((int)ClientCommandOrderWeight.CancelCommand)]
[Description(
    "当触发了部分事件时，您将获得一个取消令牌，通过调用该命令并且传入对应的取消令牌后，您可以中止正在进行的操作，以便在需要的情况下停止或撤销操作的执行。")]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/cancel.png")]
public class CancelCommand : Command
{
    [JsonProperty("cancellationToken")]
    [FormulaProperty]
    [DisplayName("取消令牌")]
    public object CancellationToken { get; set; }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.Cell;
    }

    public override string ToString()
    {
        return "取消本次操作";
    }
}