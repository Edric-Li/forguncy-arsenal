using System.ComponentModel;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight(1)]
public class UploadFolderCommand : Command
{
    [DisplayName("文件夹路径")]
    [Description("默认会按日期存放（年/月/日），如无特殊需求,不建议填写,一旦自定义,则无法使用断点续传功能")]
    [JsonProperty("folder")]
    [FormulaProperty]
    public object Folder { get; set; } = null;

    [DisplayName("冲突策略")]
    [Description("用于处理已存在相同名称文件的情况。")]
    [JsonProperty("conflictStrategy")]
    public ConflictStrategy ConflictStrategy { get; set; } = ConflictStrategy.Reject;

    [DisplayName("上传完成命令")]
    [JsonProperty("uploadSuccessCommand")]
    [CustomCommandObject(InitParamProperties = "fileId|fileName", InitParamValues = "文件ID|文件名称")]
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
    [DefaultValue(false)]
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