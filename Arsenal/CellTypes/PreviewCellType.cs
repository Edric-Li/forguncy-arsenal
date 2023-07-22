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
    [DisplayName("PDF 预览设置")]
    [JsonProperty("pdfSettings")]
    [ObjectProperty(ObjType = typeof(PdfSettings))]
    public PdfSettings PdfSettings { get; set; } = new();
    
    [DisplayName("当只有一个文件时隐藏标签页")]
    [JsonProperty("hideTabsWhenOnlyOneFile")]
    [DefaultValue(true)]
    public bool HideTabsWhenOnlyOneFile { get; set; } = true;

    [DisplayName("是否启用水印")]
    [JsonProperty("enableWatermark")]
    public bool EnableWatermark { get; set; }

    [DisplayName("水印设置")]
    [JsonProperty("watermarkSettings")]
    [ObjectProperty(ObjType = typeof(PreviewWatermarkSettings), IndentLevel = 2)]
    public PreviewWatermarkSettings WatermarkSettings { get; set; } = new();

    [DisplayName("是否禁用右键菜单")]
    [JsonProperty("disableContextMenu")]
    public bool DisableContextMenu { get; set; }

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName == nameof(WatermarkSettings))
        {
            return EnableWatermark;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }

    public override string ToString()
    {
        return "文件预览";
    }
}

public class PreviewWatermarkSettings : ObjectPropertyBase
{
    [DisplayName("宽度")]
    [JsonProperty("width")]
    public int Width { get; set; } = 120;

    [DisplayName("高度")]
    [JsonProperty("height")]
    public int Height { get; set; } = 64;

    [DisplayName("旋转角度")]
    [JsonProperty("rotate")]
    [IntProperty(Min = -360, Max = 360)]
    public int Rotate { get; set; } = -22;

    [DisplayName("层叠索引")]
    [JsonProperty("zIndex")]
    [IntProperty(Min = 0, Max = int.MaxValue)]
    public int ZIndex { get; set; } = 1000;

    [DisplayName("间距")]
    [JsonProperty("gap")]
    public string Gap { get; set; } = "100,100";

    [DisplayName("偏移")]
    [JsonProperty("offset")]
    [Description("水印距离容器左上角的偏移量，默认为 水印间距/2")]
    public string Offset { get; set; }

    [DisplayName("内容")]
    [JsonProperty("content")]
    [FormulaProperty]
    public object Content { get; set; } = "假装这是水印";

    [DisplayName("字体样式")]
    [JsonProperty("font")]
    [ObjectProperty(ObjType = typeof(PreviewFontSettings))]
    public PreviewFontSettings Font { get; set; } = new();
}

public class PreviewFontSettings : ObjectPropertyBase
{
    [DisplayName("颜色")]
    [JsonProperty("color")]
    [ColorProperty]
    public string Color { get; set; } = "rgba(0,0,0,.15)";

    [DisplayName("大小")]
    [JsonProperty("fontSize")]
    public int FontSize { get; set; } = 16;

    [DisplayName("粗细")]
    [JsonProperty("fontWeight")]
    public string FontWeight { get; set; } = "normal";

    [DisplayName("类型")]
    [JsonProperty("fontFamily")]
    public string FontFamily { get; set; } = "sans-serif";

    [DisplayName("样式")]
    [JsonProperty("fontStyle")]
    [ComboProperty(ValueList = "none|normal|italic|oblique", DisplayList = "无|正常|斜体|倾斜")]
    public string FontStyle { get; set; } = "normal";
}

public class PdfSettings : ObjectPropertyBase
{
    [DisplayName("隐藏保存按钮")]
    [JsonProperty("hideSaveButton")]
    public bool HideSaveButton { get; set; }

    [DisplayName("隐藏打印按钮")]
    [JsonProperty("hidePrintButton")]
    public bool HidePrintButton { get; set; }
}