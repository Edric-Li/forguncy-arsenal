using System.Diagnostics;
using Arsenal.Server.Common;
using Arsenal.Server.Model;
using Arsenal.Server.Model.HttpResult;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.ServerApi;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Arsenal.Server.Controllers;

public class Arsenal : ForguncyApi
{
    private void SecurityExecutionAction(Action action)
    {
        try
        {
            action.Invoke();
        }
        catch (Exception e)
        {
            BuildHttpResult(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }

    private async Task SecurityExecutionFuncAsync(Func<Task> func)
    {
        try
        {
            await func.Invoke();
        }
        catch (Exception e)
        {
            BuildHttpResult(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }

    [Post]
    public async Task InitMultipartUpload()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var body = await ParseBodyAsync<InitMultipartUploadParam>();

            var uploadId = body.FileMd5 ?? FileUploadService.GenerateUniqueFileName();

            var folderPath = Path.Combine(Configuration.Configuration.TempFolderPath, uploadId);

            var targetFolderPath = body.TargetFolderPath?.TrimStart('/').TrimEnd('/');
            
            MetadataManagement.Set(uploadId, new FileMetaData()
            {
                FileName = body.FileName,
                TargetFolder = targetFolderPath,
                ConflictStrategy = body.ConflictStrategy ?? ConflictStrategy.Rename
            });

            // 如果是不是自定义文件夹的话，取用提供的文件名,否则会根据策略生成一个文件名
            var fileName = string.IsNullOrWhiteSpace(body.TargetFolderPath)
                ? body.FileName
                : Path.GetFileName(FileUploadService.GetDestFilePathByUploadId(uploadId));

            // 如果文件不存在的话,会创建一个文件夹
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            BuildHttpResult(new HttpSuccessResult(new
            {
                uploadId,
                fileName
            }));
        });
    }

    [Get]
    public async Task CheckFileInfo()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var uploadId = Context.Request.Query["uploadId"];

            var exist = await FileUploadService.ExistsFileInUploadFolderAsync(uploadId);

            var parts = FileUploadService.ListParts(uploadId);

            BuildHttpResult(new HttpSuccessResult(new
            {
                exist,
                parts
            }));
        });
    }

    [Post]
    public async Task CreateSoftLink()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var body = await ParseBodyAsync<CreateSoftLinkParam>();

            var fileKey = FileUploadService.CreateSoftLink(body.UploadId, body.FileName);

            BuildHttpResult(new HttpSuccessResult(fileKey));
        });
    }

    [Post]
    public async Task UploadPart()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var files = Context.Request.Form.Files;

            Context.Request.Form.TryGetValue("partNumber", out var partNumber);
            Context.Request.Form.TryGetValue("uploadId", out var uploadId);

            await FileUploadService.UploadPartAsync(uploadId, Convert.ToInt32(partNumber), files[0]);

            BuildHttpResult(new HttpSuccessResult());
        });
    }

    [Post]
    public async Task CompleteMultipartUpload()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var body = await ParseBodyAsync<CompleteMultipartUploadParam>();

            var filePath = await FileUploadService.CompleteMultipartUploadAsync(body.UploadId);
            var metaData = MetadataManagement.Get(body.UploadId);

            // 文件名称,如果是自定义文件夹的话,名称取真实存储的文件名,反之,则取上传时的文件名
            var fileName = string.IsNullOrWhiteSpace(metaData.TargetFolder)
                ? metaData.FileName
                : Path.GetFileName(filePath);

            var fileId = FileUploadService.CreateSoftLink(body.UploadId, fileName);

            BuildHttpResult(new HttpSuccessResult(new
            {
                fileId,
                fileName
            }));
        });
    }

    [Post]
    public async Task CompressFilesIntoZip()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var body = await ParseBodyAsync<CompressFilesIntoZipParam>();

            var zipPath = Path.Combine(Configuration.Configuration.TempFolderPath, Guid.NewGuid().ToString(),
                body.ZipName);

            await FileUploadService.CompressFilesToZipAsync(zipPath, body.FileIds, body.NeedKeepFolderStructure);

            var data = FileUploadService.CreateFileDownloadLink(new CreateFileDownloadLinkParam()
            {
                FilePath = zipPath,
                CreateCopy = false,
                ExpirationDate = 3
            });

            BuildHttpResult(new HttpSuccessResult(data));
        });
    }

    [Get]
    public void DiskFiles()
    {
        SecurityExecutionAction(() =>
        {
            var data = FileUploadService.GetDiskFiles();

            BuildHttpResult(new HttpSuccessResult(data));
        });
    }

    [Get]
    public void SoftLinksFiles()
    {
        SecurityExecutionAction(() =>
        {
            var data = FileUploadService.GetSoftLinksFiles();

            BuildHttpResult(new HttpSuccessResult(data));
        });
    }
    
    [Get]
    public void DownloadLinksFiles()
    {
        SecurityExecutionAction(() =>
        {
            var data = FileUploadService.GetDownloadLinksFiles();

            BuildHttpResult(new HttpSuccessResult(data));
        });
    }

    private async Task<T> ParseBodyAsync<T>() where T : new()
    {
        var reader = new StreamReader(Context.Request.Body);

        var body = await reader.ReadToEndAsync();

        var data = JsonConvert.DeserializeObject<T>(body);

        return data ?? new T();
    }

    private void BuildHttpResult(HttpResult result)
    {
        Context.Response.ContentType = "application/json";
        Context.Response.WriteAsync(JsonConvert.SerializeObject(result, Formatting.None));
    }
}