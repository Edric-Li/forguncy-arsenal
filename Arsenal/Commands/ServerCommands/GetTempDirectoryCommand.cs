using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Arsenal.Server.Configuration;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("文件管理")]
[OrderWeight((int)ServerCommandOrderWeight.GettingTemporaryDirectoryCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/get-temp-folder.png")]
public class GettingTemporaryDirectoryCommand : Command, ICommandExecutableInServerSide
{
    [DisplayName("结果至变量")]
    [ResultToProperty]
    [Required]
    public string Result { get; set; }

    public ExecuteResult Execute(IServerCommandExecuteContext dataContext)
    {
        dataContext.Parameters[Result] = Configuration.TempFolderPath;

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "获取上传临时目录";
    }
}