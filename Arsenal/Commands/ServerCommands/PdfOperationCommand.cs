using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using iTextSharp.text.pdf;

namespace Arsenal;

[Category("文件管理")]
[OrderWeight((int)ServerCommandOrderWeight.PdfOperationCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/pdf.png")]
public class PdfOperationCommand : Command, ICommandExecutableInServerSideAsync, IServerCommandParamGenerator
{
    [DisplayName("文件路径")]
    [Required]
    [FormulaProperty]
    public object FilePath { get; set; }

    [DisplayName("操作类型")] [Required] public OperateType OperateType { get; set; } = OperateType.GetPageSizeInfo;

    [DisplayName("结果至变量")]
    [ResultToProperty]
    public string Result { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var filePath = (await dataContext.EvaluateFormulaAsync(FilePath))?.ToString();

        if (string.IsNullOrWhiteSpace(filePath))
        {
            throw new ArgumentException("文件路径不能为空。");
        }

        if (FileUploadService.IsValidFileKey(filePath))
        {
            filePath = await FileUploadService.GetFileFullPathByFileKeyAsync(filePath);
        }

        if (!File.Exists(filePath))
        {
            throw new ArgumentException("文件不存在。");
        }

        if (OperateType == OperateType.GetPageSizeInfo)
        {
            var pageSizeInfo = GetPageSizeInfo(filePath);
            dataContext.Parameters[Result] = pageSizeInfo.Select(item => new Dictionary<string, object>()
            {
                { "宽度", item.Width },
                { "高度", item.Height },
                { "宽度（单位：mm）", item.WidthInMm },
                { "高度（单位：mm）", item.HeightInMm },
            }).ToList();
        }

        return new ExecuteResult();
    }

    public override string ToString()
    {
        return "PDF操作";
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public IEnumerable<GenerateParam> GetGenerateParams()
    {
        if (OperateType == OperateType.GetPageSizeInfo)
        {
            yield return new GenerateListParam()
            {
                ParamName = Result,
                ItemProperties = new List<string>()
                {
                    "宽度",
                    "高度",
                    "宽度（单位：mm）",
                    "高度（单位：mm）",
                }
            };
        }
    }


    /// <summary>
    /// 获取尺寸信息
    /// </summary>
    /// <param name="filePath"></param>
    /// <returns></returns>
    private static List<PageSizeInfo> GetPageSizeInfo(string filePath)
    {
        using var pdfReader = new PdfReader(filePath);

        var result = new List<PageSizeInfo>(pdfReader.NumberOfPages);

        const float mmToPointsFactor = 72 / 25.4f; // 毫米到点的转换因子

        for (var i = 1; i <= pdfReader.NumberOfPages; i++)
        {
            var pageSize = pdfReader.GetPageSizeWithRotation(i);

            var width = pageSize.Width;
            var height = pageSize.Height;

            var widthInMm = width / mmToPointsFactor;
            var heightInMm = height / mmToPointsFactor;

            result.Add(new PageSizeInfo
            {
                Width = (int)Math.Floor(width),
                Height = (int)Math.Floor(height),
                WidthInMm = (int)Math.Floor(widthInMm),
                HeightInMm = (int)Math.Floor(heightInMm),
            });
        }

        return result;
    }
}

// 操作类型
public enum OperateType
{
    /// <summary>
    /// 获取尺寸信息
    /// </summary>
    [Description("获取尺寸信息")] GetPageSizeInfo = 100,
}

/// <summary>
/// 尺寸信息
/// </summary>
internal class PageSizeInfo
{
    /// <summary>
    /// 宽度
    /// </summary>
    public int Width { get; set; }

    /// <summary>
    /// 高度
    /// </summary>
    public int Height { get; set; }

    /// <summary>
    /// 宽度（单位：mm）
    /// </summary>
    public int WidthInMm { get; set; }

    /// <summary>
    /// 高度（单位：mm）
    /// </summary>
    public int HeightInMm { get; set; }
}