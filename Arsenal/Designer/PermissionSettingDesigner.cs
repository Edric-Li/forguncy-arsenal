using System.ComponentModel;
using System.Windows;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal.Designer;

internal class ArsenalRolePermissionEditorSetting : RolePermissionEditorSetting
{
    public ArsenalRolePermissionEditorSetting() : base(true)
    {
    }
    
    public override VerticalAlignment LabelVerticalAlignment => VerticalAlignment.Center;
    
}

public class PermissionSettingDesigner : ObjectDesigner
{
    public override EditorSetting GetEditorSetting(PropertyDescriptor property, IBuilderContextBase contextBase)
    {
        var defaultMargin = new Thickness() { Top = 5, Bottom = 5, Left = 5 };

        if (property.Name is nameof(UploadCellType.PermissionSettings.Upload)
            or nameof(UploadCellType.PermissionSettings.Delete)
            or nameof(UploadCellType.PermissionSettings.Preview)
            or nameof(UploadCellType.PermissionSettings.Download))
        {
            return new ArsenalRolePermissionEditorSetting { Margin = defaultMargin, };
        }

        return base.GetEditorSetting(property, contextBase);
    }
}