using System.ComponentModel;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[OrderWeight(2)]
[Category("文件管理 Plus")]
[SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/preview.png")]
public class PreviewCellType : CellType
{
    [DisplayName("当只有一个文件时隐藏标签页")]
    [JsonProperty("hideTabsWhenOnlyOneFile")]
    [DefaultValue(true)]
    public bool HideTabsWhenOnlyOneFile { get; set; } = true; 
    public override string ToString()
    {
        return "文件预览";
    }
}
