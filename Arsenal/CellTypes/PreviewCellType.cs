using System.ComponentModel;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[OrderWeight(2)]
[Category("文件")]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/preview.png")]
public class PreviewCellType : CellTypeBase
{
    [DisplayName("水印设置")]
    [JsonProperty("watermarkSettings")]
    [ObjectProperty(ObjType = typeof(PreviewWatermarkSettings))]
    public PreviewWatermarkSettings WatermarkSettings { get; set; } = new();

    [DisplayName("PDF设置")]
    [JsonProperty("pdfSettings")]
    [ObjectProperty(ObjType = typeof(PdfSettings))]
    public PdfSettings PdfSettings { get; set; } = new();

    [DisplayName("视频设置")]
    [JsonProperty("videoSettings")]
    [ObjectProperty(ObjType = typeof(VideoSettings))]
    public VideoSettings VideoSettings { get; set; } = new();

    [DisplayName("音频设置")]
    [JsonProperty("audioSettings")]
    [ObjectProperty(ObjType = typeof(AudioSettings))]
    public AudioSettings AudioSettings { get; set; } = new();

    [DisplayName("PPT设置")]
    [JsonProperty("powerPointSettings")]
    [ObjectProperty(ObjType = typeof(PowerPointSettings))]
    public PowerPointSettings PowerPointSettings { get; set; } = new();

    [DisplayName("Word设置")]
    [JsonProperty("wordSettings")]
    [ObjectProperty(ObjType = typeof(WordSettings))]
    public WordSettings WordSettings { get; set; } = new();

    [CategoryHeader("其他")]
    [DisplayName("当只有一个文件时隐藏标签页")]
    [JsonProperty("hideTabsWhenOnlyOneFile")]
    [DefaultValue(true)]
    public bool HideTabsWhenOnlyOneFile { get; set; } = true;

    [DisplayName("禁用右键菜单")]
    [JsonProperty("disableContextMenu")]
    public bool DisableContextMenu { get; set; }

    [DisplayName("更改PDF设置")]
    [RunTimeMethod]
    public void UpdatePdfSetting(
        [ItemDisplayName("禁止保存")] bool hideSaveButton,
        [ItemDisplayName("禁止打印")] bool hidePrintButton
    )
    {
    }

    [DisplayName("更改视频设置")]
    [RunTimeMethod]
    public void UpdateVideoSetting(
        [ItemDisplayName("自动播放")] bool autoPlay,
        [ItemDisplayName("显示控制条")] bool controls,
        [ItemDisplayName("禁止下载")] bool disableDownload,
        [ItemDisplayName("禁止画中画")] bool disablePictureInPicture,
        [ItemDisplayName("循环播放")] bool loop,
        [ItemDisplayName("静音")] bool muted,
        [ItemDisplayName("大小设置")] VideoSize size = VideoSize.Fill
    )
    {
    }

    [DisplayName("更改音频设置")]
    [RunTimeMethod]
    public void UpdateAudioSetting(
        [ItemDisplayName("自动播放")] bool autoPlay,
        [ItemDisplayName("显示控制条")] bool controls,
        [ItemDisplayName("禁止下载")] bool disableDownload,
        [ItemDisplayName("循环播放")] bool loop
    )
    {
    }

    [DisplayName("更改右键菜单状态")]
    [RunTimeMethod]
    public void UpdateContextMenuSetting(
        [ItemDisplayName("状态")] ContextMenuStatus status
    )
    {
    }

    public override string ToString()
    {
        return "文件预览";
    }
}

[Designer("Arsenal.Designer.PreviewWatermarkSettingsDesigner, Arsenal")]
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
    public object Content { get; set; } = "";

    [DisplayName("字体样式")]
    [JsonProperty("font")]
    [ObjectProperty(ObjType = typeof(PreviewFontSettings))]
    public PreviewFontSettings Font { get; set; } = new();

    [DisplayName("打开模拟器")] [JsonIgnore] public object WatermarkSimulator { get; set; }
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
    [DisplayName("禁止保存")]
    [JsonProperty("hideSaveButton")]
    public bool HideSaveButton { get; set; }

    [DisplayName("禁止打印")]
    [JsonProperty("hidePrintButton")]
    public bool HidePrintButton { get; set; }
}

public class PowerPointSettings : ObjectPropertyBase
{
    [DisplayName("允许切换预览模式")]
    [JsonProperty("allowSwitchPreviewMode")]
    [DefaultValue(true)]
    public bool AllowSwitchPreviewMode { get; set; } = true;

    [DisplayName("默认预览模式")]
    [JsonProperty("defaultPreviewMode")]
    [ComboProperty(ValueList = "auto|image|pdf", DisplayList = "自动|图片|PDF")]
    public string DefaultPreviewMode { get; set; } = "auto";

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName == nameof(DefaultPreviewMode))
        {
            return AllowSwitchPreviewMode;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}

public class WordSettings : ObjectPropertyBase
{
    [DisplayName("允许切换预览模式")]
    [JsonProperty("allowSwitchPreviewMode")]
    [DefaultValue(true)]
    public bool AllowSwitchPreviewMode { get; set; } = true;

    [DisplayName("默认预览模式")]
    [JsonProperty("defaultPreviewMode")]
    [ComboProperty(ValueList = "auto|docx|pdf", DisplayList = "自动|DOCX|PDF")]
    public string DefaultPreviewMode { get; set; } = "auto";

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName == nameof(DefaultPreviewMode))
        {
            return AllowSwitchPreviewMode;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}

public class VideoSettings : ObjectPropertyBase
{
    [DisplayName("自动播放")]
    [JsonProperty("autoPlay")]
    [DefaultValue(true)]
    public bool AutoPlay { get; set; } = true;

    [DisplayName("显示控制条")]
    [JsonProperty("controls")]
    [DefaultValue(true)]
    public bool Controls { get; set; } = true;

    [DisplayName("禁止下载")]
    [JsonProperty("disableDownload")]
    public bool DisableDownload { get; set; }

    [DisplayName("禁止画中画")]
    [JsonProperty("disablePictureInPicture")]
    public bool DisablePictureInPicture { get; set; }

    [DisplayName("循环播放")]
    [JsonProperty("loop")]
    public bool Loop { get; set; }

    [DisplayName("静音")]
    [JsonProperty("muted")]
    public bool Muted { get; set; }

    [DisplayName("大小设置")]
    [JsonProperty("size")]
    public VideoSize Size { get; set; } = VideoSize.Fill;

    [DisplayName("背景颜色")]
    [JsonProperty("backgroundColor")]
    [ColorProperty]
    public string BackgroundColor { get; set; } = "#FFFFFF";

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName is nameof(DisableDownload) or nameof(DisablePictureInPicture))
        {
            return Controls;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}

public class AudioSettings : ObjectPropertyBase
{
    [DisplayName("自动播放")]
    [JsonProperty("autoPlay")]
    [DefaultValue(true)]
    public bool AutoPlay { get; set; } = true;

    [DisplayName("显示控制条")]
    [JsonProperty("controls")]
    [DefaultValue(true)]
    public bool Controls { get; set; } = true;

    [DisplayName("禁止下载")]
    [JsonProperty("disableDownload")]
    public bool DisableDownload { get; set; }

    [DisplayName("循环播放")]
    [JsonProperty("loop")]
    public bool Loop { get; set; }

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName is nameof(DisableDownload))
        {
            return Controls;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}

public enum VideoSize
{
    [Description("填充")] Fill,
    [Description("原始")] Original
}

public enum ContextMenuStatus
{
    [Description("启用")] Enable,
    [Description("禁用")] Disable
}
