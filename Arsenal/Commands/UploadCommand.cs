﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using Arsenal.Common;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight(0)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/file.svg")]
public class UploadCommand : Command
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

    [DisplayName("允许上传文件的扩展名")]
    [JsonProperty("allowedExtensions")]
    public string AllowedExtensions { get; set; } = "*";

    [DisplayName("最大上传文件大小")]
    [JsonProperty("maxUploadSize")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    public int? MaxUploadSize { get; set; }

    [DisplayName("最大上传文件个数")]
    [IntProperty(AllowNull = true, Watermark = "不限制")]
    [JsonProperty("maxCount")]
    public int? MaxCount { get; set; }

    [DisplayName("上传完成命令")]
    [JsonProperty("uploadSuccessCommand")]
    [CustomCommandObject(InitParamProperties = "fileId|fileName", InitParamValues = "文件ID|文件名称")]
    public CustomCommandObject UploadSuccessCommand { get; set; }

    [DisplayName("高级设置")]
    [ObjectProperty(ObjType = typeof(UploadCommandAdvancedSettings))]
    [JsonProperty("advancedSettings")]
    public UploadCommandAdvancedSettings AdvancedSettings { get; set; } = new();
    
    public override bool GetDesignerPropertyVisible(string propertyName, CommandScope commandScope)
    {
        if (propertyName == nameof(AdvancedSettings.EnableCrop))
        {
            return MaxCount == 1;
        }

        return base.GetDesignerPropertyVisible(propertyName, commandScope);
    }

    public override string ToString()
    {
        return "上传文件";
    }
}

public class UploadCommandAdvancedSettings : ObjectPropertyBase
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

    [DisplayName("裁切图片")]
    [JsonProperty("enableCrop")]
    [DefaultValue(false)]
    public bool EnableCrop { get; set; }

    [DisplayName("裁剪设置")]
    [JsonProperty("imgCropSettings")]
    [ObjectProperty(ObjType = typeof(ImgCropSettings))]
    public ImgCropSettings ImgCropSettings { get; set; } = new();

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

        if (propertyName == nameof(ImgCropSettings))
        {
            return EnableCrop && GetDesignerPropertyVisible(nameof(EnableCrop));
        }

        if (propertyName == nameof(EnableResumableUpload) || propertyName == nameof(EnableCrop))
        {
            return string.IsNullOrWhiteSpace(TempValueStoreInstance.Folder?.ToString());
        }

        return base.GetDesignerPropertyVisible(propertyName);
    }
}