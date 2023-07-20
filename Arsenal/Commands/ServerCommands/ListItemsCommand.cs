using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("文件管理 Plus")]
[OrderWeight((int)ServerCommandOrderWeight.GetUploadRootDirectoryCommand)]
public class ListItemsCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("父目录")] [FormulaProperty] public object RelativePath { get; set; }

    [DisplayName("保存结果至")]
    [ResultToProperty]
    public string Result { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var relativePath = await dataContext.EvaluateFormulaAsync(RelativePath);

        var retrievalService = new RetrievalService();

        var results = await retrievalService.ListItemsAsync(new ListItemsParam()
        {
            RelativePath = relativePath?.ToString()
        });

        dataContext.Parameters[Result] = results;

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "一个实在不知道叫什么名字的命令";
    }
}