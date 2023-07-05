using System.ComponentModel;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[DisplayName("上传文件")]
public class UploadCommand : Command
{
    [DisplayName("文件夹路径")]
    [Description("默认会按日期存放（年/月/日），如无特殊需求,不建议填写,一旦自定义,则无法使用断点续传功能")]
    [JsonProperty("folder")]
    [FormulaProperty]
    public object Folder { get; set; } = null;

    [DisplayName("允许上传文件的扩展名")]
    [JsonProperty("allowedExtensions")]
    public string AllowedExtensions { get; set; } = "*";

    [DisplayName("最大上传文件大小")]
    [JsonProperty("maxUploadSize")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    public int? MaxUploadSize { get; set; }

    [DisplayName("允许多选")]
    [JsonProperty("allowMultipleSelections")]
    public bool AllowMultipleSelections { get; set; }

    [DisplayName("最大上传个数")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    [JsonProperty("maxCount")]
    public int? MaxCount { get; set; }

    [CategoryHeader("上传前")]
    [DisplayName("添加水印")]
    [JsonProperty("enableWatermark")]
    [DefaultValue(false)]
    public bool EnableWatermark { get; set; }

    [DisplayName("水印设置")]
    [JsonProperty("watermarkSettings")]
    [ObjectProperty(ObjType = typeof(WatermarkSettings))]
    public WatermarkSettings WatermarkSettings { get; set; } = new();

    [DisplayName("裁切图片")]
    [JsonProperty("enableCrop")]
    [DefaultValue(false)]
    public bool EnableCrop { get; set; }

    [DisplayName("裁剪设置")]
    [JsonProperty("imgCropSettings")]
    [ObjectProperty(ObjType = typeof(ImgCropSettings))]
    public ImgCropSettings ImgCropSettings { get; set; } = new();

    [DisplayName("启用断点续传/秒传")]
    [JsonProperty("enableResumableUpload")]
    [DefaultValue(false)]
    public bool EnableResumableUpload { get; set; } = true;

    [DisplayName("上传完成命令")]
    [CustomCommandObject]
    public CustomCommandObject UploadSuccessCommand { get; set; }

    public override bool GetDesignerPropertyVisible(string propertyName, CommandScope commandScope)
    {
        if (propertyName == nameof(WatermarkSettings))
        {
            return EnableWatermark;
        }

        if (propertyName == nameof(ImgCropSettings))
        {
            return EnableCrop;
        }

        if (propertyName == nameof(MaxCount))
        {
            return AllowMultipleSelections;
        }

        return base.GetDesignerPropertyVisible(propertyName, commandScope);
    }

    public override string ToString()
    {
        return "上传文件";
    }
}