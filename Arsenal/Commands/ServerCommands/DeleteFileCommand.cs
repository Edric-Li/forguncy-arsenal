using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ServerCommandOrderWeight.DeleteFileCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/delete-file.png")]
public class DeleteFileCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("附件值")]
    [FormulaProperty]
    [Required]
    public object FileKeys { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var fileKeys = (await dataContext.EvaluateFormulaAsync(FileKeys))?.ToString();

        if (string.IsNullOrWhiteSpace(fileKeys))
        {
            throw new ArgumentException("附件值不能为空。");
        }

        var files = fileKeys.Split("|", StringSplitOptions.RemoveEmptyEntries);

        foreach (var file in files)
        {
            await FileUploadService.DeleteFileAsync(file);
        }

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "删除文件";
    }
}