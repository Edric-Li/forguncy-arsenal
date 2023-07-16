using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ServerCommandOrderWeight.ExtractZipFileToDirectoryCommand)]
public class ExtractZipFileToDirectoryCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("压缩文件路径")]
    [Description("服务器上的压缩文件路径。")]
    [Required]
    public string ZipFilePath { get; set; }

    [DisplayName("解压缩文件夹路径")]
    [Description("服务器上的解压缩文件夹路径。")]
    [Required]
    public string ExtractDirectoryPath { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var zipFilePath = (await dataContext.EvaluateFormulaAsync(ZipFilePath))?.ToString();
        var extractDirectoryPath = (await dataContext.EvaluateFormulaAsync(ExtractDirectoryPath))?.ToString();

        CompressService.ExtractToDirectory(zipFilePath, extractDirectoryPath);

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }
    
    public override string ToString()
    {
        return "解压缩文件到文件夹";
    }
}