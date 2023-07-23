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

[Category("文件管理")]
[OrderWeight((int)ServerCommandOrderWeight.CompressFilesIntoZipCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/zip.png")]
public class CompressFilesIntoZipCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("附件值")]
    [FormulaProperty]
    [Required]
    public object FileKeys { get; set; }

    [DisplayName("压缩文件路径")]
    [FormulaProperty]
    [Required]
    public object ZipFilePath { get; set; }

    [DisplayName("在压缩文件中保持文件夹结构")]
    [JsonProperty("needKeepFolderStructure")]
    [DefaultValue(true)]
    public bool NeedKeepFolderStructure { get; set; } = true;

    [DisplayName("冲突策略")]
    [Description("用于处理压缩文件已经存在的情况。")]
    public CompressFilesIntoZipCommandConflictStrategy ConflictStrategy { get; set; } =
        CompressFilesIntoZipCommandConflictStrategy.Reject;

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var fileKeys = (await dataContext.EvaluateFormulaAsync(FileKeys))?.ToString();
        var zipFilePath = (await dataContext.EvaluateFormulaAsync(ZipFilePath))?.ToString();

        if (string.IsNullOrWhiteSpace(fileKeys))
        {
            throw new ArgumentException("附件值不能为空。");
        }

        if (string.IsNullOrWhiteSpace(zipFilePath))
        {
            throw new ArgumentException("压缩文件夹路径不能为空。");
        }

        if (File.Exists(zipFilePath) && ConflictStrategy == CompressFilesIntoZipCommandConflictStrategy.Reject)
        {
            throw new Exception($"文件夹{Path.GetDirectoryName(zipFilePath)}下存在同名文件{Path.GetFileName(zipFilePath)}。");
        }

        var files = fileKeys.Split("|").ToArray();
        await CompressService.CompressFilesToZipAsync(zipFilePath, files, NeedKeepFolderStructure);
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
