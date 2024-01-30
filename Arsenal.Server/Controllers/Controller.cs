using Arsenal.Server.Common;
using Arsenal.Server.Model;
using Arsenal.Server.Model.HttpResult;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Provider;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.ServerApi;

namespace Arsenal.Server.Controllers;

public class Arsenal : ForguncyApi
{
    void PreInit()
    {
        BootstrapService.EnsureInitialization(Context);
    }

    void CheckAuthenticated()
    {
        var userIdentity = Context.User.Identity;
        if (userIdentity == null)
        {
            throw new Exception("Unauthorized");
        }
    }

    [Post]
    public async Task InitMultipartUpload()
    {
        PreInit();

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

            meteData.Uploader ??= "Arsenal_Anonymous";

            CacheServiceProvider.UploadMetadataCacheService.Set(uploadId, meteData);

            var fileName = await FileUploadService.GenerateAppropriateFileNameByUploadId(uploadId);

            if (fileName != meteData.Name)
            {
                meteData.Name = fileName;
                CacheServiceProvider.UploadMetadataCacheService.Set(uploadId, meteData);
            }

            var tempFolderPath = Path.Combine(Configuration.Configuration.TempFolderPath, body.Hash ?? uploadId);

            // 如果文件不存在的话,会创建一个文件夹
            if (!Directory.Exists(tempFolderPath))
            {
                Directory.CreateDirectory(tempFolderPath);
            }

            await Context.BuildResultAsync(new HttpSuccessResult(new
            {
                uploadId,
                fileName
            }));
        });
    }

    [Get]
    public async Task CheckFileInfo()
    {
        PreInit();

        await Context.HandleErrorAsync(async () =>
        {
            var uploadId = Context.Request.Query["uploadId"];

            var exist = await FileUploadService.CheckFileInfoAsync(uploadId);

            var parts = FileUploadService.ListParts(uploadId);

            await Context.BuildResultAsync(new HttpSuccessResult(new
            {
                exist,
                parts
            }));
        });
    }

    [Post]
    public async Task UploadPart()
    {
        PreInit();

        await Context.HandleErrorAsync(async () =>
        {
            var files = Context.Request.Form.Files;

            Context.Request.Form.TryGetValue("partNumber", out var partNumber);
            Context.Request.Form.TryGetValue("uploadId", out var uploadId);

            await FileUploadService.UploadPartAsync(uploadId, Convert.ToInt32(partNumber), files[0]);
            await Context.BuildResultAsync(new HttpSuccessResult());
        });
    }

    [Post]
    public async Task CompleteMultipartUpload()
    {
        PreInit();

        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<CompleteMultipartUploadParam>();

            var fileEntity = await FileUploadService.CompleteMultipartUploadAsync(body.UploadId);

            await Context.BuildResultAsync(new HttpSuccessResult(new
            {
                fileKey = fileEntity.Key,
                fileName = fileEntity.Name
            }));
        });
    }

    [Post]
    public async Task AddFileRecord()
    {
        PreInit();

        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<AddFileRecordParam>();

            var fileEntity = await FileUploadService.AddFileRecordAsync(body.UploadId);

            await Context.BuildResultAsync(new HttpSuccessResult(fileEntity.Key));
        });
    }

    [Post]
    public async Task CompressFilesIntoZip()
    {
        PreInit();

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

            await Context.BuildResultAsync(new HttpSuccessResult(data));
        });
    }

    [Get]
    public async Task GetZipEntries()
    {
        PreInit();

        await Context.HandleErrorAsync(async () =>
        {
            var fileKey = Context.Request.Query["fileKey"];

            var diskFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            var entries = ZipService.GetZipEntries(diskFilePath);

            await Context.BuildResultAsync(new HttpSuccessResult(entries));
        });
    }

    [Get]
    public async Task GetTemporaryAccessKeyForZipFile()
    {
        PreInit();

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

            await Context.BuildResultAsync(new HttpSuccessResult(newFileKey));
        });
    }

    [Get]
    public async Task GetConvertableFileExtensions()
    {
        PreInit();

        await Context.HandleErrorAsync(async () =>
        {
            var result = await FileConvertService.GetConvertableFileExtensionsAsync();
            await Context.BuildResultAsync(new HttpSuccessResult(result));
        });
    }

    [Get]
    public async Task CreateFileConversionTask()
    {
        await Context.HandleErrorAsync(async () =>
        {
            await FileConvertService.CreateFileConversionTask(Context);
            await Context.BuildResultAsync(new HttpSuccessResult());
        });
    }

    [Post]
    public async Task UploadSingleFile()
    {
        PreInit();
        CheckAuthenticated();

        await Context.HandleErrorAsync(async () =>
        {
            var files = Context.Request.Form.Files;

            if (files.Count == 0)
            {
                throw new Exception("No file uploaded.");
            }

            var file = files.FirstOrDefault();
            var fileName = file.FileName;

            if (Context.Request.Form.TryGetValue("fileName", out var customFileName))
            {
                fileName = customFileName.ToString();
            }

            var result = await FileUploadService.UploadSingleFileAsync(file, fileName);
            await Context.BuildResultAsync(new HttpSuccessResult(result));
        });
    }

    [Post]
    public async Task UploadSingleFileByBase64()
    {
        PreInit();
        CheckAuthenticated();

        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<UploadSingleFileByBase64Param>();
            var result = FileUploadService.UploadSingleFileByBase64(body.Base64, body.FileName);
            await Context.BuildResultAsync(new HttpSuccessResult(result));
        });
    }
}
