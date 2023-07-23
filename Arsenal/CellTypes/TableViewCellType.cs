using System.ComponentModel;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[OrderWeight(4)]
[Category("文件管理")]
[SupportUsingScope(PageScope.None, ListViewScope.None)]
public class TableViewCellType : CellType
{
    [DisplayName("附件值")]
    [JsonProperty("fileKeys")]
    [FormulaProperty]
    public object FileKeys { get; set; }

    public override string ToString()
    {
        return "表格视图";
    }
}