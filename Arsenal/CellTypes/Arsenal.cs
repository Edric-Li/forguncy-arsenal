﻿using System.ComponentModel;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/icon.png")]
public class Arsenal : CellType
{
    [DisplayName("文件夹路径")]
    [Description("如无特殊需求,不建议填写,一旦自定义,则无法使用断点续传功能")]
    [FormulaProperty]
    public object Folder { get; set; } = null;
    
    [DisplayName("允许上传的文件类型")]
    public string AllowedFileTypes { get; set; } = "*";
    
    [DisplayName("启用断点续传/秒传")]
    [Description("如果开启断点续传,则会在客户端计算文件的MD5值,如果你觉得计算时间过长,可以将其关闭")]
    [DefaultValue(false)]
    public bool EnableResumableUpload { get; set; } = true;

    [DisplayName("允许多选")]
    [DefaultValue(false)] 
    public bool AllowMultipleSelection { get; set; } = false;
    
    [DisplayName("文件列表类型")]
    public ListType ListType { get; set; } = ListType.Text;

    public override string ToString()
    {
        return "文件上传";
    }
}

public enum ListType
{
    [Description("经典")] Text,
    [Description("图片列表")] Picture,
    [Description("照片墙")] PictureCard,
    [Description("圆形照片墙")] PictureCircle
}