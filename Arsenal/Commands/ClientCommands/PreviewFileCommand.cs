using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理")]
[OrderWeight((int)ClientCommandOrderWeight.PreviewFileCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/preview-file.png")]
public class PreviewFileCommand : Command
{
    [DisplayName("URL")]
    [JsonProperty("url")]
    [FormulaProperty]
    [Required]
    public object Url { get; set; }

    [DisplayName("预览设置")]
    [JsonProperty("previewSetting")]
    [ObjectProperty(ObjType = typeof(PreviewSetting))]
    public PreviewSetting PreviewSetting { get; set; } = new();

    public override string ToString()
    {
        return "预览文件";
    }
}