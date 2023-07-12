using System.ComponentModel;
using System.Threading.Tasks;
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
    public object FileName { get; set; }

    [DisplayName("压缩文件路径")]
    [FormulaProperty]
    public object ZipFilePath { get; set; }

    public Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        throw new System.NotImplementedException();
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