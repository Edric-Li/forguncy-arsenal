using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ServerCommandOrderWeight.CompressFilesIntoZipCommand)]
public class CompressFilesIntoZipCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("文件名称")]
    [FormulaProperty]
    [Required]
    public object FileNames { get; set; }

    [DisplayName("压缩文件路径")]
    [FormulaProperty]
    [Required]
    public object ZipFilePath { get; set; }

    [DisplayName("保持文件夹结构")]
    [JsonProperty("keepFolderStructure")]
    [DefaultValue(true)]
    public bool NeedKeepFolderStructure { get; set; } = true;

    [DisplayName("冲突策略")] public CompressFilesIntoZipCommandConflictStrategy ConflictStrategy { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var fileNames = (await dataContext.EvaluateFormulaAsync(FileNames))?.ToString();
        var zipFilePath = (await dataContext.EvaluateFormulaAsync(ZipFilePath))?.ToString();

        if (string.IsNullOrWhiteSpace(fileNames))
        {
            throw new ArgumentException("文件名称不能为空。");
        }

        if (string.IsNullOrWhiteSpace(zipFilePath))
        {
            throw new ArgumentException("压缩文件夹路径不能为空。");
        }

        if (File.Exists(zipFilePath) && ConflictStrategy == CompressFilesIntoZipCommandConflictStrategy.Reject)
        {
            throw new Exception($"文件夹{Path.GetDirectoryName(zipFilePath)}下存在同名文件{Path.GetFileName(zipFilePath)}。");
        }

        var files = fileNames.Split("|").ToArray();
        await FileUploadService.CompressFilesToZipAsync(zipFilePath, files, NeedKeepFolderStructure);
        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "压缩文件为zip包";
    }
}

public enum CompressFilesIntoZipCommandConflictStrategy
{
    [Description("覆盖现有文件")] Overwrite,
    [Description("告知用户")] Reject,
}
