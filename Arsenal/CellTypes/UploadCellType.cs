using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Arsenal.Common;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[OrderWeight(1)]
[Category("文件")]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/upload.png")]
public class UploadCellType : CellTypeBase, ISupportDisable, ISupportReadOnly
{
    private ListType _listType = ListType.Text;
    
    [DisplayName("权限设置")]
    [JsonProperty("permissionSettings")]
    [ObjectProperty(ObjType = typeof(PermissionSettings))]
    public PermissionSettings PermissionSettings { get; set; } = new();

    [DisplayName("事件设置")]
    [JsonProperty("eventSettings")]
    [ObjectProperty(ObjType = typeof(EventSettings))]
    public EventSettings EventSettings { get; set; } = new();

    [DisplayName("预览设置")]
    [JsonProperty("previewSetting")]
    [ObjectProperty(ObjType = typeof(PreviewSetting))]
    public PreviewSetting PreviewSetting { get; set; } = new();

    [DisplayName("上传设置")]
    [JsonProperty("uploadSettings")]
    [ObjectProperty(ObjType = typeof(UploadSettings))]
    public UploadSettings UploadSettings { get; set; } = new();

    [DisplayName("文件列表类型")]
    [JsonProperty("listType")]
    public ListType ListType
    {
        get => _listType;
        set
        {
            _listType = value;
            TempValueStoreInstance.ListType = value;
        }
    }

    [CategoryHeader("其他")]
    [DisplayName("禁用")]
    [DefaultValue(false)]
    public bool IsDisabled { get; set; }

    [DisplayName("只读")]
    [DefaultValue(false)]
    public bool ReadOnly { get; set; } = false;

    [RunTimeMethod]
    [DisplayName("上传文件")]
    public void Upload()
    {
    }

    [RunTimeMethod]
    [DisplayName("上传文件夹")]
    public void UploadFolder()
    {
    }

    [RunTimeMethod]
    [DisplayName("设置元素显示状态")]
    public void SetElementDisplayState(
        [ItemDisplayName("元素")] [Required] Element element,
        [ItemDisplayName("显示状态")] [Required] ElementState state
    )
    {
    }

    public override bool GetRunTimeMethodVisible(string name)
    {
        if (name == nameof(UploadFolder))
        {
            return UploadSettings.AllowFolderSelection;
        }

        return base.GetRunTimeMethodVisible(name);
    }

    public override string ToString()
    {
        return "文件上传";
    }
}

public enum FileSelectionType
{
    [Description("文件")] File,
    [Description("文件夹")] Folder,
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
    [JsonProperty("upload", ObjectCreationHandling = ObjectCreationHandling.Replace)]
    public List<string> Upload { get; set; } = new() { "FGC_Anonymous" };

    [DisplayName("下载")]
    [JsonProperty("download", ObjectCreationHandling = ObjectCreationHandling.Replace)]
    public List<string> Download { get; set; } = new() { "FGC_Anonymous" };

    [DisplayName("预览")]
    [JsonProperty("preview", ObjectCreationHandling = ObjectCreationHandling.Replace)]
    public List<string> Preview { get; set; } = new() { "FGC_Anonymous" };

    [DisplayName("删除")]
    [JsonProperty("delete", ObjectCreationHandling = ObjectCreationHandling.Replace)]
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
    public bool EnableResumableUpload { get; set; }

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

    [DisplayName("允许选择文件夹")]
    [JsonProperty("allowFolderSelection")]
    public bool AllowFolderSelection { get; set; }

    [DisplayName("默认选择文件类型")]
    [JsonProperty("defaultSelectionOfFileType")]
    public FileSelectionType DefaultSelectionOfFileType { get; set; }

    [DisplayName("显示拖拽区域")]
    [JsonProperty("allowDragAndDrop")]
    public bool AllowDragAndDrop { get; set; }

    [DisplayName("拖拽区域设置")]
    [JsonProperty("dragAndDropSettings")]
    [ObjectProperty(ObjType = typeof(DragAndDropSettings))]
    public DragAndDropSettings DragAndDropSettings { get; set; } = new();

    [DisplayName("计算文件哈希值")]
    [JsonProperty("computeHash")]
    [Description("开启后，可在上传前以及上传后的事件中获取到文件的哈希值。")]
    public bool ComputeHash { get; set; }

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

        if (propertyName == nameof(DragAndDropSettings))
        {
            return AllowDragAndDrop;
        }

        if (propertyName == nameof(AllowFolderSelection))
        {
            return TempValueStoreInstance.ListType is ListType.Text or ListType.Picture;
        }

        if (propertyName == nameof(DefaultSelectionOfFileType))
        {
            return AllowFolderSelection && GetDesignerPropertyVisible(nameof(AllowFolderSelection));
        }

        if (propertyName == nameof(ComputeHash))
        {
            return EnableResumableUpload == false;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}

public class DragAndDropSettings : ObjectPropertyBase
{
    [UserControlPageProperty]
    [DisplayName("拖拽区域对应组件")]
    [JsonProperty("dragUserControlPage")]
    public string DragUserControlPage { get; set; }

    [DisplayName("拖拽区域对应组件高度")]
    [JsonProperty("height")]
    public int Height { get; set; } = 300;
}

public class EventSettings : ObjectPropertyBase
{
    [DisplayName("上传前")]
    [JsonProperty("beforeUpload")]
    [CustomCommandObject(InitParamProperties = "name|ext|size|hash",
        InitParamValues = "文件名称|扩展名|大小|哈希值")]
    public CustomCommandObject BeforeUpload { get; set; }

    [DisplayName("上传后")]
    [JsonProperty("afterUpload")]
    [CustomCommandObject(InitParamProperties = "name|ext|size|fileKey|hash",
        InitParamValues = "文件名称|扩展名|大小|附件值|哈希值")]
    public CustomCommandObject AfterUpload { get; set; }

    [DisplayName("预览前")]
    [JsonProperty("beforePreview")]
    [CustomCommandObject(InitParamProperties = "name|fileKey",
        InitParamValues = "文件名称|附件值")]
    public CustomCommandObject BeforePreview { get; set; }
    
    [DisplayName("下载前")]
    [JsonProperty("beforeDownload")]
    [CustomCommandObject(InitParamProperties = "name|fileKey",
        InitParamValues = "文件名称|附件值")]
    public CustomCommandObject BeforeDownload { get; set; }

    [DisplayName("删除前")]
    [JsonProperty("beforeDelete")]
    [CustomCommandObject(InitParamProperties = "name|fileKey",
        InitParamValues = "文件名称|附件值")]
    public CustomCommandObject BeforeDelete { get; set; }
}

public class PreviewSetting : ObjectPropertyBase
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

    [DisplayName("当只有一个文件时隐藏标签页")]
    [JsonProperty("hideTabsWhenOnlyOneFile")]
    [DefaultValue(true)]
    [Browsable(false)]
    public bool HideTabsWhenOnlyOneFile { get; set; } = true;

    [DisplayName("禁用右键菜单")]
    [JsonProperty("disableContextMenu")]
    public bool DisableContextMenu { get; set; }
}