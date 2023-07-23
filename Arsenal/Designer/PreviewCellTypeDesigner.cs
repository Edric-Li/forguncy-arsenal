using System;
using System.ComponentModel;
using System.Windows.Input;
using Arsenal.Common;
using Arsenal.WpfControls;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal.Designer;

public class PreviewWatermarkSettingsDesigner : ObjectDesigner
{
    public override EditorSetting GetEditorSetting(PropertyDescriptor property, IBuilderContextBase contextBase)
    {
        if (property.Name == nameof(PreviewCellType.WatermarkSettings.WatermarkSimulator))
        {
            return new HyperlinkEditorSetting(new WatermarkEditorCommand()
            {
                IndexHtmlPath =
                    CommonUtils.GetWatermarkEditorIndexHtmlPath((contextBase as dynamic).ForguncyUploadFilesFolderPath),
            })
            {
                FontSize = 12
            };
        }

        return base.GetEditorSetting(property, contextBase);
    }
}

internal class WatermarkEditorCommand : ICommand
{
    public string IndexHtmlPath { get; set; }

    public bool CanExecute(object parameter)
    {
        return true;
    }

    public void Execute(object parameter)
    {
        new WatermarkEditor(IndexHtmlPath).Show();
    }

    public event EventHandler CanExecuteChanged = delegate { };
}