using System.Windows;
using GrapeCity.Forguncy.CellTypes;

namespace Arsenal.Designer;

public class UploadCellTypeDesigner : CellTypeDesigner<UploadCellType>
{
    public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
    {
        return drawingHelper.GetHeadlessBrowserPreviewControl();
    }
}
