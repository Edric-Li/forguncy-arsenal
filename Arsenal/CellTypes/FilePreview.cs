using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/preview.png")]
public class FilePreview : CellType
{
    public override string ToString()
    {
        return "文件预览";
    }
}
