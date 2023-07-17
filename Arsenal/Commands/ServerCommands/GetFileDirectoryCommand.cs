﻿using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.Commands;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

[Category("Arsenal")]
[OrderWeight((int)ServerCommandOrderWeight.GetFileDirectoryCommand)]
[Icon("pack://application:,,,/Arsenal;component/Resources/images/get-file-folder.png")]

public class GetFileDirectoryCommand : Command, ICommandExecutableInServerSideAsync
{
    [DisplayName("附件值")]
    [FormulaProperty]
    [Required]
    public object FileKey { get; set; }

    [DisplayName("结果至变量")]
    [ResultToProperty]
    [Required]
    public string Result { get; set; }

    public async Task<ExecuteResult> ExecuteAsync(IServerCommandExecuteContext dataContext)
    {
        var fileKey = (await dataContext.EvaluateFormulaAsync(FileKey))?.ToString();

        if (string.IsNullOrWhiteSpace(fileKey))
        {
            throw new ArgumentException("文件名称不能为空。");
        }

        var result = FileUploadService.GetFileDirectory(fileKey);
        dataContext.Parameters[Result] = result;
        return new ExecuteResult();
    }

    public override CommandScope GetCommandScope()
    {
        return CommandScope.ExecutableInServer;
    }

    public override string ToString()
    {
        return "获取文件所在目录";
    }
}