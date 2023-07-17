using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Arsenal.Common;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[OrderWeight(1)]
[Category("文件管理 Plus")]
[SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/upload.png")]
public class UploadCellType : CellType, INeedUploadFileByUser, ISupportDisable, ISupportReadOnly
{
    [DisplayName("权限设置")]
    [JsonProperty("permissionSettings")]
    [ObjectProperty(ObjType = typeof(PermissionSettings))]
    public PermissionSettings PermissionSettings { get; set; } = new();

    [DisplayName("上传设置")]
    [JsonProperty("uploadSettings")]
    [ObjectProperty(ObjType = typeof(UploadSettings))]
    public UploadSettings UploadSettings { get; set; } = new();

    [DisplayName("文件列表类型")]
    [JsonProperty("listType")]
    public ListType ListType { get; set; } = ListType.Text;

    [CategoryHeader("其他")]
    [DisplayName("禁用")]
    [DefaultValue(false)]
    public bool IsDisabled { get; set; }

    [DisplayName("只读")]
    [DefaultValue(false)]
    public bool ReadOnly { get; set; } = false;

    [RunTimeMethod]
    [DisplayName("设置元素显示状态")]
    public void SetElementDisplayState(
        [ItemDisplayName("元素")] [Required] Element element,
        [ItemDisplayName("显示状态")] [Required] ElementState state
    )
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

    public override string ToString()
    {
        return "文件上传";
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

public enum ConflictStrategy
{
    [Description("覆盖现有文件")] Overwrite,
    [Description("重命名新文件")] Rename,
    [Description("告知用户")] Reject,
}

public enum Element
{
    [Description("上传按钮")] Upload,
    [Description("删除按钮")] Delete,
    [Description("预览按钮")] Preview,
    [Description("下载按钮")] Download
}

public enum ElementState
{
    [Description("可见")] Visible,
    [Description("不可见")] Hidden,
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

[Designer("Arsenal.Designer.PermissionSettingDesigner, Arsenal")]
public class PermissionSettings : ObjectPropertyBase
{
    [DisplayName("上传")]
    [JsonProperty("upload")]
    public List<string> Upload { get; set; } = new() { "FGC_Anonymous" };

    [DisplayName("下载")]
    [JsonProperty("download")]
    public List<string> Download { get; set; } = new() { "FGC_Anonymous" };

    [DisplayName("预览")]
    [JsonProperty("preview")]
    public List<string> Preview { get; set; } = new() { "FGC_Anonymous" };

    [DisplayName("删除")]
    [JsonProperty("delete")]
    public List<string> Delete { get; set; } = new() { "FGC_Anonymous" };
}

public class UploadSettings : ObjectPropertyBase
{
    private object _folder = string.Empty;

    [DisplayName("文件夹路径")]
    [Description("默认会按日期存放（年/月/日）。")]
    [JsonProperty("folder")]
    [FormulaProperty]
    public object Folder
    {
        get => _folder;
        set
        {
            _folder = value ?? string.Empty;
            TempValueStoreInstance.Folder = value;
        }
    }

    [DisplayName("冲突策略")]
    [Description("用于处理已存在相同名称文件的情况。")]
    [JsonProperty("conflictStrategy")]
    public ConflictStrategy ConflictStrategy { get; set; } = ConflictStrategy.Reject;
    
    [DisplayName("允许上传文件的扩展名")]
    [JsonProperty("allowedExtensions")]
    public string AllowedExtensions { get; set; } = "*";

    [DisplayName("最大上传文件大小(单位:MB)")]
    [JsonProperty("maxSize")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    public int? MaxSize { get; set; }

    [DisplayName("最大上传个数")]
    [JsonProperty("maxCount")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    public int? MaxCount { get; set; }

    [DisplayName("支持断点续传和秒传")]
    [JsonProperty("enableResumableUpload")]
    [DefaultValue(true)]
    public bool EnableResumableUpload { get; set; } = true;

    [DisplayName("支持上传前添加水印")]
    [JsonProperty("enableWatermark")]
    [DefaultValue(false)]
    public bool EnableWatermark { get; set; }

    [DisplayName("水印设置")]
    [JsonProperty("watermarkSettings")]
    [ObjectProperty(ObjType = typeof(WatermarkSettings))]
    public WatermarkSettings WatermarkSettings { get; set; } = new();

    [DisplayName("支持在文件对话框中多选文件")]
    [JsonProperty("multiple")]
    public bool Multiple { get; set; } = true;

    [DisplayName("支持上传前裁切图片")]
    [JsonProperty("enableCrop")]
    [DefaultValue(false)]
    public bool EnableCrop { get; set; } = false;

    [DisplayName("裁剪设置")]
    [JsonProperty("imgCropSettings")]
    [ObjectProperty(ObjType = typeof(ImgCropSettings))]
    public ImgCropSettings ImgCropSettings { get; set; } = new();

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName == nameof(ConflictStrategy))
        {
            return !string.IsNullOrWhiteSpace(Folder?.ToString());
        }
        
        if (propertyName == nameof(Multiple))
        {
            return MaxCount is null or > 1;
        }

        if (propertyName == nameof(WatermarkSettings))
        {
            return EnableWatermark;
        }

        if (propertyName == nameof(EnableCrop))
        {
            return !Multiple || !GetDesignerPropertyVisible(nameof(Multiple));
        }

        if (propertyName == nameof(ImgCropSettings))
        {
            return EnableCrop && GetDesignerPropertyVisible(nameof(EnableCrop));
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}