using System.Collections.Generic;
using System.Windows;
using Arsenal.Common;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal.Designer;

public class UploadCellTypeDesigner : CellTypeDesigner<UploadCellType>, ICellTypeChecker
{
    public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
    {
        return drawingHelper.GetHeadlessBrowserPreviewControl();
    }

    public IEnumerable<ForguncyErrorInfo> CheckCellTypeErrors(IBuilderContext context)
    {
        if (!CommonUtils.IsValidFolder(this.CellType.UploadSettings.Folder?.ToString()))
        {
            yield return new ForguncyErrorInfo() { ErrorType = ForguncyErrorType.Warning, Message = "文件夹路径设置错误，请检查!" };
        }
    }
}
