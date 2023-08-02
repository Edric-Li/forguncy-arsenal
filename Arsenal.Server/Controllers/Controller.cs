﻿using Arsenal.Server.Common;
using Arsenal.Server.Model;
using Arsenal.Server.Model.HttpResult;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.ServerApi;

namespace Arsenal.Server.Controllers;

public class Arsenal : ForguncyApi
{
    [Post]
    public async Task InitMultipartUpload()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<InitMultipartUploadParam>();

            var uploadId = FileUploadService.GenerateUniqueFileName();

            var targetFolderPath =
                body.FolderPath?.TrimStart('/').TrimEnd('/') ?? FileUploadService.GetCurrentDateFolder();

            var meteData = new FileMetaData()
            {
                Name = body.Name,
                Hash = body.Hash,
                FolderPath = targetFolderPath,
                ContentType = body.ContentType,
                Ext = Path.GetExtension(body.Name),
                Size = body.Size,
                ConflictStrategy = body.ConflictStrategy ?? ConflictStrategy.Rename
            };

            var userIdentity = Context.User.Identity;

            if (userIdentity != null)
            {
                meteData.Uploader = userIdentity.Name;
            }

            MetadataCacheService.Set(uploadId, meteData);

            var fileName = await FileUploadService.GenerateAppropriateFileNameByUploadId(uploadId);

            if (fileName != meteData.Name)
            {
                MetadataCacheService.Get(uploadId).Name = fileName;
            }

            var tempFolderPath = Path.Combine(Configuration.Configuration.TempFolderPath, body.Hash ?? uploadId);

            // 如果文件不存在的话,会创建一个文件夹
            if (!Directory.Exists(tempFolderPath))
            {
                Directory.CreateDirectory(tempFolderPath);
            }

            Context.BuildResult(new HttpSuccessResult(new
            {
                uploadId,
                fileName
            }));
        });
    }

    [Get]
    public async Task CheckFileInfo()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var uploadId = Context.Request.Query["uploadId"];

            var exist = await FileUploadService.CheckFileInfoAsync(uploadId);

            var parts = FileUploadService.ListParts(uploadId);

            Context.BuildResult(new HttpSuccessResult(new
            {
                exist,
                parts
            }));
        });
    }

    [Post]
    public async Task UploadPart()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var files = Context.Request.Form.Files;

            Context.Request.Form.TryGetValue("partNumber", out var partNumber);
            Context.Request.Form.TryGetValue("uploadId", out var uploadId);

            await FileUploadService.UploadPartAsync(uploadId, Convert.ToInt32(partNumber), files[0]);
            Context.BuildResult(new HttpSuccessResult());
        });
    }

    [Post]
    public async Task CompleteMultipartUpload()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<CompleteMultipartUploadParam>();

            var fileEntity = await FileUploadService.CompleteMultipartUploadAsync(body.UploadId);

            Context.BuildResult(new HttpSuccessResult(new
            {
                fileKey = fileEntity.Key,
                fileName = fileEntity.Name
            }));
        });
    }

    [Post]
    public async Task AddFileRecord()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<AddFileRecordParam>();

            var fileEntity = await FileUploadService.AddFileRecordAsync(body.UploadId);

            Context.BuildResult(new HttpSuccessResult(fileEntity.Key));
        });
    }

    [Post]
    public async Task CompressFilesIntoZip()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<CompressFilesIntoZipParam>();

            var zipPath = Path.Combine(Configuration.Configuration.TempFolderPath, Guid.NewGuid().ToString(),
                body.ZipName);

            await CompressService.CompressFilesToZipAsync(zipPath, body.FileIds, body.NeedKeepFolderStructure);

            var data = await FileUploadService.CreateFileDownloadLink(new CreateFileDownloadLinkParam
            {
                FilePath = zipPath,
                CreateCopy = false,
                ExpirationDate = 3
            });

            Context.BuildResult(new HttpSuccessResult(data));
        });
    }

    [Get]
    public async Task GetZipEntries()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var fileKey = Context.Request.Query["fileKey"];

            var diskFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            var entries = ZipService.GetZipEntries(diskFilePath);

            Context.BuildResult(new HttpSuccessResult(entries));
        });
    }

    [Get]
    public async Task GetTemporaryAccessKeyForZipFile()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var fileKey = Context.Request.Query["fileKey"];
            var targetFilePath = Context.Request.Query["targetFilePath"];
            var zipFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            var savePath = Path.Combine(Configuration.Configuration.TempFolderPath,
                Guid.NewGuid() + Path.GetExtension(targetFilePath));

            ZipService.ExtractFileFromZip(zipFilePath, savePath, targetFilePath);

            var newFileKey = await FileUploadService.CreateFileDownloadLink(new CreateFileDownloadLinkParam()
            {
                FilePath = savePath,
                CreateCopy = false,
                ExpirationDate = 3,
                DownloadFileName = Path.GetFileName(targetFilePath)
            });

            Context.BuildResult(new HttpSuccessResult(newFileKey));
        });
    }
}