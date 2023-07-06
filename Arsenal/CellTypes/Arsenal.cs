using System.Collections.Generic;
using System.ComponentModel;
using Arsenal.Common;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/icon.png")]
public class Arsenal : CellType, INeedUploadFileByUser, ISupportDisable, ISupportReadOnly, ISupportUIPermission
{
    [DisplayName("上传限制")]
    [JsonProperty("uploadSettings")]
    [ObjectProperty(ObjType = typeof(UploadSettings))]
    public UploadSettings UploadSettings { get; set; } = new();

    [DisplayName("单元格权限")] public List<UIPermission> UIPermissions { get; set; } = GetDefaultPermission();
    
    [DisplayName("文件夹路径")]
    [Description("默认会按日期存放（年/月/日），如无特殊需求,不建议填写,一旦自定义,则无法使用断点续传功能")]
    [JsonProperty("folder")]
    [FormulaProperty]
    public object Folder { get; set; } = null;

    [DisplayName("文件列表类型")]
    [JsonProperty("listType")]
    public ListType ListType { get; set; } = ListType.Text;

    [CategoryHeader("上传前")]
    [DisplayName("添加水印")]
    [JsonProperty("enableWatermark")]
    [DefaultValue(false)]
    public bool EnableWatermark { get; set; }

    [DisplayName("水印设置")]
    [JsonProperty("watermarkSettings")]
    [ObjectProperty(IndentLevel = 2, ObjType = typeof(WatermarkSettings))]
    public WatermarkSettings WatermarkSettings { get; set; } = new();

    [DisplayName("裁切图片")]
    [JsonProperty("enableCrop")]
    [DefaultValue(false)]
    public bool EnableCrop { get; set; } = false;

    [DisplayName("裁剪设置")]
    [JsonProperty("imgCropSettings")]
    [ObjectProperty(IndentLevel = 2, ObjType = typeof(ImgCropSettings))]
    public ImgCropSettings ImgCropSettings { get; set; } = new();

    [CategoryHeader("其他")]
    [DisplayName("禁用")]
    [DefaultValue(false)]
    public bool IsDisabled { get; set; }

    [DisplayName("只读")]
    [DefaultValue(false)]
    public bool ReadOnly { get; set; } = false;

    [DisplayName("启用断点续传/秒传")]
    [JsonProperty("enableResumableUpload")]
    [DefaultValue(true)]
    public bool EnableResumableUpload { get; set; } = true;

    [RunTimeMethod]
    [DisplayName("上传")]
    public void Upload()
    {
    }

    public List<FileCopyInfo> GetAllFileSourceAndTargetPathsWhenImportForguncyFile(IFileUploadContext context)
    {
        return default;
    }

    public FileUploadInfo GetUploadFileInfosWhenSaveFile(IFileUploadContext context)
    {
        CommonUtils.CopyWebSiteFilesToDesigner(context);
        return null;
    }

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName == nameof(WatermarkSettings))
        {
            return EnableWatermark;
        }

        if (propertyName == nameof(ImgCropSettings))
        {
            return EnableCrop;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }

    public override string ToString()
    {
        return "文件上传";
    }

    private static List<UIPermission> GetDefaultPermission()
    {
        var defaultAllowRoles = new List<string> { "FGC_Anonymous" };
        return new List<UIPermission>
        {
            new() { Scope = UIPermissionScope.Enable, AllowRoles = defaultAllowRoles },
            new() { Scope = UIPermissionScope.Editable, AllowRoles = defaultAllowRoles },
            new() { Scope = UIPermissionScope.Visible, AllowRoles = defaultAllowRoles },
        };
    }
}

public enum ListType
{
    [Description("经典")] 
    Text,
    [Description("图片列表")] 
    Picture,
    [Description("照片墙")] 
    PictureCard,
    [Description("圆形照片墙")] 
    PictureCircle
}

public class WatermarkSettings : ObjectPropertyBase
{
    [DisplayName("填充颜色")]
    [JsonProperty("fillStyle")]
    [ColorProperty]
    public string FillStyle { get; set; } = "black";

    [DisplayName("字体大小")]
    [JsonProperty("fontSize")]
    public int FontSize { get; set; } = 33;

    [DisplayName("字体")]
    [JsonProperty("fontFamily")]
    public string FontFamily { get; set; } = "Arial";

    [DisplayName("文字")]
    [FormulaProperty]
    [JsonProperty("text")]
    public object Text { get; set; } = "活字格 666";

    [DisplayName("X坐标")]
    [JsonProperty("x")]
    public int X { get; set; } = 20;

    [DisplayName("Y坐标")]
    [JsonProperty("y")]
    public int Y { get; set; } = 20;
}

public class ImgCropSettings : ObjectPropertyBase
{
    [DisplayName("图片质量")]
    [JsonProperty("quality")]
    [PercentageProperty]
    public double Quality { get; set; } = 0.4;

    [DisplayName("重置按钮文字")]
    [JsonProperty("resetText")]
    public string ResetText { get; set; } = "重置";

    [DisplayName("裁切形状")]
    [ComboProperty(ValueList = "rect|round", DisplayList = "矩形|圆形")]
    [JsonProperty("cropShape")]
    public string CropShape { get; set; } = "rect";

    [DisplayName("弹窗标题")]
    [JsonProperty("modalTitle")]
    public string ModalTitle { get; set; } = "裁剪图片";

    [DisplayName("确定按钮文字")]
    [JsonProperty("modalOk")]
    public string ModalOk { get; set; } = "确定";

    [DisplayName("取消按钮文字")]
    [JsonProperty("modalCancel")]
    public string ModalCancel { get; set; } = "取消";

    [DisplayName("显示裁切区域网格")]
    [JsonProperty("showGrid")]
    public bool ShowGrid { get; set; }

    [DisplayName("图片旋转控制")]
    [JsonProperty("rotationSlider")]
    [DefaultValue(true)]
    public bool RotationSlider { get; set; } = true;

    [DisplayName("裁切比率控制")]
    [JsonProperty("aspectSlider")]
    [DefaultValue(true)]
    public bool AspectSlider { get; set; } = true;

    [DisplayName("显示重置按钮")]
    [JsonProperty("showReset")]
    [DefaultValue(true)]
    public bool ShowReset { get; set; } = true;

    [DisplayName("居中显示")]
    [JsonProperty("centered")]
    [DefaultValue(true)]
    public bool Centered { get; set; } = true;
}

public class UploadSettings : ObjectPropertyBase
{
    [DisplayName("允许上传文件的扩展名")]
    [JsonProperty("allowedExtensions")]
    public string AllowedExtensions { get; set; } = "*";

    [DisplayName("最大上传文件大小")]
    [JsonProperty("maxUploadSize")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    public int? MaxUploadSize { get; set; }

    [DisplayName("最大上传个数")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    public int? MaxCount { get; set; }
}