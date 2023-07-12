using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ServerCommandOrderWeight.GetFileFullPathCommand)]
public class GetFileFullPathCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("文件路径")]
    [FormulaProperty]
    [Required]
    public object FileName { get; set; }

    [DisplayName("结果至变量")]
    [ResultToProperty]
    [Required]
    public string Result { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var fileName = (await dataContext.EvaluateFormulaAsync(FileName))?.ToString();

        if (string.IsNullOrWhiteSpace(fileName))
        {
            throw new ArgumentException("文件名称不能为空。");
        }

        var result = FileUploadService.GetFileFullPathByFileId(fileName);
        dataContext.Parameters[Result] = result;
        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "获取文件的全路径";
    }
}