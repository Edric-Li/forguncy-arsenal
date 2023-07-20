using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Arsenal.Server.Common;
using Arsenal.Server.Configuration;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ServerCommandOrderWeight.CopyServerFolderToArsenalFolderCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/move.png")]
public class CopyServerFolderToArsenalFolderCommand : Command, ICommandExecutableInServerSideAsync,
    IServerCommandParamGenerator
{
    [DisplayName("服务器文件夹路径")]
    [FormulaProperty]
    [Description("服务器上的文件夹路径。")]
    [Required]
    public object LocalFolder { get; set; }

    [DisplayName("目标文件夹路径")]
    [Description("同步到的目标文件夹路径, 相对于上传根目录。")]
    [FormulaProperty]
    [Required]
    public object TargetRelativeFolderPath { get; set; }

    [DisplayName("冲突策略")]
    [Description("用于处理目标文件夹已经存在的情况。")]
    [Required]
    public UploadServerFolderCommandConflictStrategy ConflictStrategy { get; set; } =
        UploadServerFolderCommandConflictStrategy.Reject;

    [DisplayName("保存附件值到")]
    [ResultToProperty]
    public string FileKeys { get; set; }

    [DisplayName("保存详细信息到")]
    [ResultToProperty]
    public string DetailedInformation { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var localFolderValue = (await dataContext.EvaluateFormulaAsync(LocalFolder))?.ToString();
        var targetRelativeFolderPath = (await dataContext.EvaluateFormulaAsync(TargetRelativeFolderPath))?.ToString();

        var localFolder = SeparatorConverter.ConvertToSystemSeparator(localFolderValue);

        var targetFolder = Path.Combine(Configuration.UploadFolderPath,
            SeparatorConverter.ConvertToSystemSeparator(targetRelativeFolderPath));

        if (Directory.Exists(targetFolder))
        {
            if (ConflictStrategy == UploadServerFolderCommandConflictStrategy.Overwrite)
            {
                Directory.Delete(targetFolder);
            }
            else if (ConflictStrategy == UploadServerFolderCommandConflictStrategy.Reject)
            {
                throw new Exception(
                    $"文件夹{Path.GetDirectoryName(targetFolder)}下存在同名文件夹{Path.GetFileName(targetFolder)}。");
            }
        }

        CopyFiles(localFolder, targetFolder);

        var files = GetFilesInDirectory(targetFolder!);

        var uploadServerFolderParams = files.Select(item => new UploadServerFolderParam()
        {
            Name = item.FileName,
            Ext = item.Extension,
            Size = item.Size,
            FolderPath = Path.Combine(targetFolder, Path.GetDirectoryName(item.RelativePath) ?? string.Empty),
        }).ToList();

        var keys = await FileUploadService.UploadServerFolderAsync(dataContext.CurrentUserName,
            uploadServerFolderParams);

        for (var i = 0; i < files.Count; i++)
        {
            files[i].FileKey = keys[i];
        }

        dataContext.Parameters[FileKeys] = string.Join(",", keys);
        dataContext.Parameters[DetailedInformation] = files.Select(item => new Dictionary<string, object>()
        {
            { "附件值", item.FileKey },
            { "文件名称", item.FileName },
            { "扩展名", item.Extension },
            { "相对路径", item.RelativePath },
            { "创建时间", item.CreationTime },
            { "最后访问时间", item.LastAccessTime },
            { "大小（字节）", item.Size },
        }).ToList();

        return new ExecuteResult();
    }

    private static void CopyFiles(string sourceDirectory, string destinationDirectory)
    {
        Directory.CreateDirectory(destinationDirectory);

        var files = Directory.GetFiles(sourceDirectory);

        foreach (var filePath in files)
        {
            var fileName = Path.GetFileName(filePath);
            var destinationFilePath = Path.Combine(destinationDirectory, fileName);

            File.Copy(filePath, destinationFilePath, true);
        }

        var subdirectories = Directory.GetDirectories(sourceDirectory);

        foreach (var subdirectoryPath in subdirectories)
        {
            var subdirectoryName = Path.GetFileName(subdirectoryPath);
            var destinationSubdirectoryPath = Path.Combine(destinationDirectory, subdirectoryName);

            CopyFiles(subdirectoryPath, destinationSubdirectoryPath);
        }
    }

    private static List<ItemEntity> GetFilesInDirectory(string directoryPath)
    {
        var result = new List<ItemEntity>();

        return GetFilesInDirectory(directoryPath, directoryPath, result);
    }

    private static List<ItemEntity> GetFilesInDirectory(string rootPath, string directoryPath, List<ItemEntity> result)
    {
        var fileEntries = Directory.GetFiles(directoryPath);

        foreach (var filePath in fileEntries)
        {
            var fileInfo = new FileInfo(filePath);

            result.Add(new ItemEntity()
            {
                FileKey = fileInfo.Name,
                FileName = fileInfo.Name,
                Extension = fileInfo.Extension,
                RelativePath = Path.GetRelativePath(rootPath, filePath).Replace("\\", "/"),
                CreationTime = fileInfo.CreationTime,
                LastAccessTime = fileInfo.LastAccessTime,
                Size = fileInfo.Length,
            });
        }

        var subdirectoryEntries = Directory.GetDirectories(directoryPath);

        foreach (var subdirectoryPath in subdirectoryEntries)
        {
            GetFilesInDirectory(rootPath, subdirectoryPath, result);
        }

        return result;
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }
    
    public override string ToString()
    {
        return "复制服务器文件夹到附件文件夹";
    }

    public IEnumerable<GenerateParam> GetGenerateParams()
    {
        yield return new GenerateListParam()
        {
            ParamName = DetailedInformation,
            ItemProperties = new List<string>()
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
}

public class ItemEntity
{
    public string FileKey { get; set; }

    public string FileName { get; set; }

    public string Extension { get; set; }

    public string RelativePath { get; set; }

    public DateTime CreationTime { get; set; }

    public DateTime LastAccessTime { get; set; }

    public long Size { get; set; }
}

public enum UploadServerFolderCommandConflictStrategy
{
    [Description("覆盖现有文件夹")] Overwrite,
    [Description("告知用户")] Reject,
}