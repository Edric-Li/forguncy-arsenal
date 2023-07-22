using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Arsenal.Common;
using Arsenal.Server.Model.Params;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ServerCommandOrderWeight.CreateAccessLinkToFileCommand)]
[Description("可为服务器端文件创建一个临时访问链接, 该链接可以在指定的时间内被使用。")]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/create-download-link.png")]
public class CreateAccessLinkToFileCommand : Command, ICommandExecutableInServerSideAsync, INeedUploadFileByUser
{
    [DisplayName("服务器文件路径")]
    [FormulaProperty]
    [Required]
    public object FilePath { get; set; }

    [DisplayName("显示文件名")]
    [Description("如果指定了文件名，则下载链接将使用指定的文件名。如果未指定文件名，则下载链接将使用原始文件名。")]
    [FormulaProperty]
    public object FileName { get; set; }

    [DisplayName("链接有效期(分钟)")]
    [Description("可以设置此属性来指定下载链接的有效期限。如果将过期时间设置为 0，则表示下载链接永不过期。")]
    [FormulaProperty]
    [Required]
    public object ExpirationDate { get; set; } = 10;

    [DisplayName("创建副本")]
    [Description("创建副本后，即使原始文件被删除或移动，您仍然可以使用该下载链接下载文件。")]
    public bool CreateCopy { get; set; }

    [DisplayName("保存访问链接到")]
    [ResultToProperty]
    public string FileLinkResult { get; set; }

    [DisplayName("保存文件值到")]
    [ResultToProperty]
    public string FileKeyResult { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var filePath = (await dataContext.EvaluateFormulaAsync(FilePath))?.ToString();
        var expirationDateStr = (await dataContext.EvaluateFormulaAsync(ExpirationDate))?.ToString();
        var fileName = (await dataContext.EvaluateFormulaAsync(FileName))?.ToString();

        if (!int.TryParse(expirationDateStr, out var expirationDate))
        {
            throw new ArgumentException("参数类型错误，请确保输入整数值。(链接有效期)。");
        }

        if (expirationDate < 0)
        {
            throw new ArgumentException("错误：参数必须是一个大于0或等于0的整数。请提供有效的参数值。(链接有效期)。");
        }

        if (!File.Exists(filePath))
        {
            throw new ArgumentException("文件未找到，请确保输入的文件路径正确。");
        }

        var result = await Server.Services.FileUploadService.CreateFileDownloadLink(new CreateFileDownloadLinkParam()
        {
            FilePath = filePath,
            DownloadFileName = fileName,
            ExpirationDate = expirationDate,
            CreateCopy = CreateCopy
        });

        if (!string.IsNullOrWhiteSpace(FileKeyResult))
        {
            dataContext.Parameters[FileKeyResult] = result;
        }

        if (!string.IsNullOrWhiteSpace(FileLinkResult))
        {
            dataContext.Parameters[FileLinkResult] = dataContext.AppBaseUrl + "Upload/" + result;
        }

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public List<FileCopyInfo> GetAllFileSourceAndTargetPathsWhenImportForguncyFile(IFileUploadContext context)
    {
        return new List<FileCopyInfo>(0);
    }

    public FileUploadInfo GetUploadFileInfosWhenSaveFile(IFileUploadContext context)
    {
        CommonUtils.CopyWebSiteFilesToDesigner(context);
        return null;
    }

    public override string ToString()
    {
        return "创建文件临时访问链接";
    }
}