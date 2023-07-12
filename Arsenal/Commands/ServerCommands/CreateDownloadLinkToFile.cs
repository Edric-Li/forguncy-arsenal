﻿using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using Arsenal.Server.Model.Params;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ServerCommandOrderWeight.CreateDownloadLinkToFileCommand)]
public class CreateDownloadLinkToFileCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("文件路径")]
    [FormulaProperty]
    [Required]
    public object FilePath { get; set; }

    [DisplayName("链接有效期(分钟)")]
    [Description("可以设置此属性来指定下载链接的有效期限。如果将过期时间设置为 0，则表示下载链接永不过期。")]
    [FormulaProperty]
    [Required]
    public object ExpirationDate { get; set; } = 60;

    [DisplayName("创建副本")]
    [Description("创建副本后，即使原始文件被删除或移动，您仍然可以使用该下载链接下载文件。")]
    public bool CreateCopy { get; set; }

    [DisplayName("结果至变量")]
    [ResultToProperty]
    [Required]
    public string Result { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var filePath = (await dataContext.EvaluateFormulaAsync(FilePath))?.ToString();
        var expirationDateStr = (await dataContext.EvaluateFormulaAsync(ExpirationDate))?.ToString();

        if (!int.TryParse(expirationDateStr, out var expirationDate))
        {
            throw new ArgumentException("参数类型错误，请确保输入整数值。(链接有效期)。");
        }

        if (expirationDate < 0)
        {
            throw new ArgumentException("错误：参数必须是一个大于0或等于0的整数。请提供有效的参数值。(链接有效期)。");
        }

        if (!File.Exists(filePath))
        {
            throw new ArgumentException("文件未找到，请确保输入的文件路径正确。");
        }

        var result = Server.Services.FileUploadService.CreateFileDownloadLink(new CreateFileDownloadLinkParam()
        {
            FilePath = filePath,
            ExpirationDate = expirationDate,
            CreateCopy = CreateCopy
        });

        dataContext.Parameters[Result] = dataContext.AppBaseUrl + "FileDownloadUpload/Download?file=" + result;

        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "创建文件下载链接";
    }
}