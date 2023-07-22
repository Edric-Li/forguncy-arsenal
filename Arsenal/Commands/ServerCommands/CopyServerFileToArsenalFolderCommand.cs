using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Arsenal.Common;
using Arsenal.Server.Common;
using Arsenal.Server.Configuration;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ServerCommandOrderWeight.CopyServerFileToArsenalFolderCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/move.png")]
public class CopyServerFileToArsenalFolderCommand : Command, ICommandExecutableInServerSideAsync,
    IServerCommandParamGenerator, INeedUploadFileByUser
{
    [DisplayName("服务器文件路径")]
    [FormulaProperty]
    [Description("服务器上的文件夹路径。")]
    [Required]
    public object LocalFilePath { get; set; }

    [DisplayName("目标文件夹路径")]
    [Description("目标文件夹路径, 相对于上传根目录。")]
    [FormulaProperty]
    [Required]
    public object TargetRelativeFolderPath { get; set; }

    [DisplayName("冲突策略")]
    [Description("用于处理目标文件已经存在的情况。")]
    [Required]
    public CopyServerFileToArsenalFolderCommandConflictStrategy ConflictStrategy { get; set; } =
        CopyServerFileToArsenalFolderCommandConflictStrategy.Reject;

    [DisplayName("保存附件值到")]
    [ResultToProperty]
    public string FileKey { get; set; }

    [DisplayName("保存详细信息到")]
    [ResultToProperty]
    public string DetailedInformation { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var filePath = (await dataContext.EvaluateFormulaAsync(LocalFilePath))?.ToString();
        var targetRelativeFolderPath = (await dataContext.EvaluateFormulaAsync(TargetRelativeFolderPath))?.ToString();

        var localFilePath = Path.Combine(Configuration.UploadFolderPath,
            SeparatorConverter.ConvertToSystemSeparator(filePath));

        var targetFolderPath = SeparatorConverter.ConvertToSystemSeparator(targetRelativeFolderPath);

        var relativePath = Path.Combine(targetFolderPath, Path.GetFileName(filePath));

        if (await FileUploadService.ExistsFileAsync(relativePath))
        {
            if (ConflictStrategy == CopyServerFileToArsenalFolderCommandConflictStrategy.Overwrite)
            {
                // todo
            }
            else if (ConflictStrategy == CopyServerFileToArsenalFolderCommandConflictStrategy.Reject)
            {
                throw new Exception(
                    $"文件夹{Path.GetDirectoryName(targetFolderPath)}下存在同名文件{Path.GetFileName(localFilePath)}。");
            }
        }

        var fileInfo = new FileInfo(localFilePath);

        var uploadServerFolderParam = new UploadServerFolderParam()
        {
            Name = fileInfo.Name,
            Ext = fileInfo.Extension,
            Size = fileInfo.Length,
            FolderPath = targetFolderPath
        };

        var key = await FileUploadService.CopyServerFileToArsenalFolder(dataContext.CurrentUserName, localFilePath,
            uploadServerFolderParam);

        if (!string.IsNullOrWhiteSpace(FileKey))
        {
            dataContext.Parameters[FileKey] = key;
        }

        if (!string.IsNullOrWhiteSpace(DetailedInformation))
        {
            dataContext.Parameters[DetailedInformation] = new Dictionary<string, object>()
            {
                { "附件值", key },
                { "文件名称", fileInfo.Name },
                { "扩展名", fileInfo.Extension },
                { "相对路径", targetFolderPath },
                { "创建时间", fileInfo.CreationTime },
                { "最后访问时间", fileInfo.LastAccessTime },
                { "大小（字节）", fileInfo.Length },
            };
        }

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public IEnumerable<GenerateParam> GetGenerateParams()
    {
        yield return new GenerateObjectParam()
        {
            ParamName = DetailedInformation,
            SubProperties = new List<string>()
            {
                "附件值",
                "文件名称",
                "扩展名",
                "相对路径",
                "创建时间",
                "最后访问时间",
                "大小（字节）"
            },
        };
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
        return "复制服务器文件到附件文件夹下";
    }
}

public enum CopyServerFileToArsenalFolderCommandConflictStrategy
{
    [Description("覆盖现有文件夹")] Overwrite,
    [Description("告知用户")] Reject,
}