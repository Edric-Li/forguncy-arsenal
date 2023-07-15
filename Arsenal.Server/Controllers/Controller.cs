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

            var uploadId = FileUploadService.GenerateUniqueFileName();


            var targetFolderPath =
                body.FolderPath?.TrimStart('/').TrimEnd('/') ?? FileUploadService.GetCurrentDateFolder();

            MetadataCacheService.Set(uploadId, new FileMetaData()
            {
                Name = body.Name,
                Hash = body.Hash,
                FolderPath = targetFolderPath,
                ContentType = body.ContentType,
                Ext = Path.GetExtension(body.Name),
                Size = body.Size,
                Uploader = "Administrator",
                ConflictStrategy = body.ConflictStrategy ?? ConflictStrategy.Rename
            });

            var fileName = await FileUploadService.GenerateAppropriateFileNameByUploadId(uploadId);

            var tempFolderPath = Path.Combine(Configuration.Configuration.TempFolderPath, body.Hash ?? uploadId);

            // 如果文件不存在的话,会创建一个文件夹
            if (!Directory.Exists(tempFolderPath))
            {
                Directory.CreateDirectory(tempFolderPath);
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

            var exist = await FileUploadService.CheckFileInfoAsync(uploadId);

            var parts = FileUploadService.ListParts(uploadId);

            BuildHttpResult(new HttpSuccessResult(new
            {
                exist,
                parts
            }));
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

            var fileEntity = await FileUploadService.CompleteMultipartUploadAsync(body.UploadId);
            
            BuildHttpResult(new HttpSuccessResult(new
            {
                fileId = fileEntity.Key,
                fileName = fileEntity.Name
            }));
        });
    }

    [Post]
    public async Task AddFileRecord()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var body = await ParseBodyAsync<CreateSoftLinkParam>();

            var fileEntity = await FileUploadService.AddFileRecordAsync(body.UploadId);

            BuildHttpResult(new HttpSuccessResult(fileEntity.Key));
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