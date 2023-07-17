using System.ComponentModel;
using Arsenal.Common;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ClientCommandOrderWeight.UploadFolderCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/upload-folder.png")]

public class UploadFolderCommand : Command
{
    private object _folder = string.Empty;

    [DisplayName("文件夹路径")]
    [Description("默认会按日期存放（年/月/日），如无特殊需求,不建议填写,一旦自定义,则无法使用断点续传功能")]
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

    [DisplayName("上传完成命令")]
    [JsonProperty("uploadSuccessCommand")]
    [CustomCommandObject(InitParamProperties = "fileKey|fileName", InitParamValues = "附件值|文件名称")]
    public CustomCommandObject UploadSuccessCommand { get; set; }

    [DisplayName("高级设置")]
    [ObjectProperty(ObjType = typeof(UploadFolderCommandAdvancedSettings))]
    [JsonProperty("advancedSettings")]
    public UploadFolderCommandAdvancedSettings AdvancedSettings { get; set; } = new();

    public override string ToString()
    {
        return "上传文件夹";
    }
}

public class UploadFolderCommandAdvancedSettings : ObjectPropertyBase
{
    [DisplayName("上传完成命令触发时机")]
    [JsonProperty("uploadSuccessCommandTriggerTiming")]
    [ComboProperty(ValueList = "single|all", DisplayList = "单个文件上传成功后执行|全部文件上传后执行")]
    public string UploadSuccessCommandTriggerTiming { get; set; } = "all";

    [DisplayName("添加水印")]
    [JsonProperty("enableWatermark")]
    [DefaultValue(false)]
    public bool EnableWatermark { get; set; }

    [DisplayName("水印设置")]
    [JsonProperty("watermarkSettings")]
    [ObjectProperty(ObjType = typeof(WatermarkSettings))]
    public WatermarkSettings WatermarkSettings { get; set; } = new();

    [DisplayName("断点续传/秒传")]
    [JsonProperty("enableResumableUpload")]
    [DefaultValue(true)]
    public bool EnableResumableUpload { get; set; } = true;

    public override bool GetDesignerPropertyVisible(string propertyName)
    {
        if (propertyName == nameof(WatermarkSettings))
        {
            return EnableWatermark;
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}