using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO.Compression;
using Arsenal.Server.Common;
using Arsenal.Server.DataBase;
using Arsenal.Server.DataBase.Models;
using Arsenal.Server.Model;
using Arsenal.Server.Model.Params;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Exception = System.Exception;
using File = System.IO.File;

namespace Arsenal.Server.Services;

public static class FileUploadService
{
    #region Private Method

    private static readonly ConcurrentDictionary<string, Task<string>> MergeTaskMap = new();

    private static readonly object MergeTaskMapLock = new();

    public static async Task<bool> CheckFileInfoAsync(string uploadId)
    {
        var metaData = MetadataCacheService.Get(uploadId);

        if (metaData == null)
        {
            throw new Exception("无效的上传ID");
        }

        var relativePath = Path.Combine(metaData.FolderPath, metaData.Name);

        if (!string.IsNullOrWhiteSpace(metaData.Hash))
        {
            var dbContext = new DatabaseContext();

            var item = await dbContext.FileHashes.FirstOrDefaultAsync(item => item.Hash == metaData.Hash);

            await dbContext.DisposeAsync();

            if (item == null)
            {
                return false;
            }

            relativePath = item.Path;
        }

        return await ExistsFileAsync(relativePath);
    }

    public static async Task<bool> ExistsFileAsync(string relativePath)
    {
        var filePath = Path.Combine(Configuration.Configuration.UploadFolderPath, relativePath);

        var existsFile = File.Exists(filePath);

        if (!existsFile && Configuration.Configuration.AppConfig.UseCloudStorage)
        {
            existsFile =
                await CloudStorageService.FileExistsAsync(
                    CloudStorageService.GetCloudStorageFilePath(relativePath));
        }

        return existsFile;
    }

    private static async Task CopyStreamAsync(Stream stream, string destPath)
    {
        await using var fileStream = new FileStream(destPath, FileMode.Create, FileAccess.Write);
        stream.Seek(0, SeekOrigin.Begin);
        await stream.CopyToAsync(fileStream);
    }

    public static string GetCurrentDateFolder()
    {
        var currentTime = DateTime.Now;

        var folderPath = Path.Combine(
            currentTime.Year.ToString(),
            currentTime.Month.ToString(),
            currentTime.Day.ToString());

        return folderPath;
    }

    private static async Task<string> MergeFileAsync(string uploadId)
    {
        var parts = ListParts(uploadId);

        parts.Sort();

        var folderName = MetadataCacheService.Get(uploadId).Hash ?? uploadId;

        var tmpFile = Path.Combine(Configuration.Configuration.TempFolderPath, folderName, ".merge");

        if (File.Exists(tmpFile))
        {
            File.Delete(tmpFile);
        }

        if (parts.Count == 1)
        {
            return GetPartFilePath(folderName, 0);
        }

        var fs = new FileStream(tmpFile, FileMode.OpenOrCreate);
        await MergeFileByParts(parts, fs, folderName);
        fs.Close();

        return tmpFile;
    }

    /// <summary>
    /// 根据metadata中的key获取合适的文件名
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public static async Task<string> GenerateAppropriateFileNameByUploadId(string key)
    {
        var metadata = MetadataCacheService.Get(key);

        if (metadata == null)
        {
            throw new Exception("无效的上传ID");
        }

        if (string.IsNullOrWhiteSpace(metadata.Hash))
        {
            return GenerateAppropriateFileNameByMetaData(metadata);
        }

        return await GenerateAppropriateFileNameForFileWithHash(metadata);
    }

    /// <summary>
    /// 生成有hash的文件的合适的文件名
    /// </summary>
    /// <param name="metadata"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    private static async Task<string> GenerateAppropriateFileNameForFileWithHash(FileMetaData metadata)
    {
        var dbContext = new DatabaseContext();

        try
        {
            var fileEntity = await dbContext.Files.FirstOrDefaultAsync(
                i => i.FolderPath == metadata.FolderPath && i.Name == metadata.Name);

            // 如果不存在, 直接返回原始名称即可
            if (fileEntity == null)
            {
                return metadata.Name;
            }

            switch (metadata.ConflictStrategy)
            {
                case ConflictStrategy.Overwrite:
                    dbContext.Remove(fileEntity);
                    await dbContext.SaveChangesAsync();
                    return metadata.Name;

                case ConflictStrategy.Rename:
                    var num = 1;
                    var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(metadata.Name);
                    var extension = Path.GetExtension(metadata.Name);

                    string GetNextFileName() => $"{fileNameWithoutExtension}({num}){extension}";

                    while (true)
                    {
                        var nextFileName = GetNextFileName();

                        var fileEntity2 = await dbContext.Files.FirstOrDefaultAsync(
                            i => i.FolderPath == SeparatorConverter.ConvertToDatabaseSeparator(metadata.FolderPath) &&
                                 i.Name == nextFileName);

                        if (fileEntity2 == null)
                        {
                            return nextFileName;
                        }

                        num++;
                    }
                case ConflictStrategy.Reject:
                default:
                    throw new Exception($"文件夹{metadata.FolderPath}下存在同名文件{metadata.Name}。");
            }
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }
    }

    /// <summary>
    /// 根据metadata生成合适的文件名
    /// </summary>
    /// <param name="metadata"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    private static string GenerateAppropriateFileNameByMetaData(FileMetaData metadata)
    {
        // 根据文件名和目标文件夹获取绝对路径
        string GetAbsolutePath(string filename) =>
            Path.Combine(Configuration.Configuration.UploadFolderPath, metadata.FolderPath, filename);

        var targetFilePath = GetAbsolutePath(metadata.Name);

        if (!File.Exists(targetFilePath))
        {
            return Path.GetFileName(targetFilePath);
        }

        switch (metadata.ConflictStrategy)
        {
            case ConflictStrategy.Overwrite:
                File.Delete(targetFilePath);
                break;

            case ConflictStrategy.Rename:
                var num = 1;
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(metadata.Name);
                var extension = Path.GetExtension(metadata.Name);

                string GetNextFilePath() => GetAbsolutePath($"{fileNameWithoutExtension}({num}){extension}");

                var nextFilePath = GetNextFilePath();

                while (File.Exists(nextFilePath))
                {
                    num++;
                }

                return Path.GetFileName(nextFilePath);

            default:
                throw new Exception($"文件夹{metadata.FolderPath}下存在同名文件{metadata.Name}。");
        }

        return Path.GetFileName(targetFilePath);
    }

    private static async Task MergeFileByParts(IEnumerable<int> parts, Stream fs, string fileName)
    {
        var partStreams = parts
            .Select(part => new FileStream(GetPartFilePath(fileName, part), FileMode.Open))
            .ToList();

        foreach (var partStream in partStreams)
        {
            await partStream.CopyToAsync(fs);
            partStream.Close();
        }
    }

    private static string GetPartFilePath(string fileName, int part)
    {
        return Path.Combine(Configuration.Configuration.TempFolderPath, fileName, part.ToString());
    }

    private static void CleanUpFileJunkFiles(string tmpFile, string uploadId)
    {
        try
        {
            File.Delete(tmpFile);
            var metaData = MetadataCacheService.Get(uploadId);
            Directory.Delete(Path.Combine(Configuration.Configuration.TempFolderPath, metaData?.Hash ?? uploadId),
                true);
        }
        catch (Exception e)
        {
            Trace.WriteLine(e);
        }
    }

    private static void MoveTemporaryFileToFinalDirectory(string filePath, string absolutePath)
    {
        if (!Directory.Exists(Path.GetDirectoryName(absolutePath)))
        {
            Directory.CreateDirectory(Path.GetDirectoryName(absolutePath) ?? string.Empty);
        }

        if (File.Exists(absolutePath))
        {
            return;
        }

        File.Move(filePath, absolutePath);
    }

    #endregion

    # region Public Method

    public static List<int> ListParts(string uploadId)
    {
        var metaData = MetadataCacheService.Get(uploadId);
        var folderPath = Path.Combine(Configuration.Configuration.TempFolderPath, metaData.Hash ?? uploadId);

        return !Directory.Exists(folderPath)
            ? new List<int>()
            : Directory.GetFiles(folderPath).Select(fullPath => Convert.ToInt32(Path.GetFileName(fullPath))).ToList();
    }

    public static async Task UploadPartAsync(string uploadId, int partNumber, IFormFile file)
    {
        var metaData = MetadataCacheService.Get(uploadId);

        var folderName = metaData.Hash ?? uploadId;
        var folderPath = Path.Combine(Configuration.Configuration.TempFolderPath, folderName);
        var filePath = Path.Combine(folderPath, partNumber.ToString());
        var fileTempPath = Path.Combine(folderPath, partNumber.ToString()) + "_tmp";

        // 如果文件存在, 无需覆盖
        if (File.Exists(filePath))
        {
            return;
        }

        try
        {
            await CopyStreamAsync(file.OpenReadStream(), fileTempPath);
            File.Move(fileTempPath, filePath);
        }
        catch (Exception)
        {
            File.Delete(fileTempPath);
            throw;
        }
    }

    public static async Task<DataBase.Models.File> CompleteMultipartUploadAsync(string uploadId)
    {
        var metaData = MetadataCacheService.Get(uploadId);

        var key = metaData.Hash ?? uploadId;

        Task<string> task;

        lock (MergeTaskMapLock)
        {
            MergeTaskMap.TryGetValue(key, out task);
        }

        if (task == null)
        {
            lock (MergeTaskMapLock)
            {
                MergeTaskMap.TryGetValue(key, out task);

                task ??= MergeFileAsync(uploadId);

                MergeTaskMap.TryAdd(key, task);
            }
        }

        var mergedFilePath = await task;

        MergeTaskMap.TryRemove(key, out _);

        var fileName = await GenerateAppropriateFileNameByUploadId(uploadId);

        if (!string.IsNullOrWhiteSpace(metaData.Hash))
        {
            fileName = metaData.Hash + Path.GetExtension(fileName);
        }

        var relativePath = Path.Combine(metaData.FolderPath, fileName);

        var targetFilePath =
            Path.Combine(Configuration.Configuration.UploadFolderPath, relativePath);

        MoveTemporaryFileToFinalDirectory(mergedFilePath, targetFilePath);

        CleanUpFileJunkFiles(mergedFilePath, uploadId);

        if (Configuration.Configuration.AppConfig.UseCloudStorage)
        {
            _ = CloudStorageService.CreateUploadTaskAsync(
                targetFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", string.Empty));
        }

        var dbContext = new DatabaseContext();

        try
        {
            if (!string.IsNullOrWhiteSpace(metaData.Hash))
            {
                var exist = await dbContext.FileHashes.AnyAsync(i => i.Hash == metaData.Hash && i.Path == relativePath);

                if (!exist)
                {
                    dbContext.FileHashes.Add(new FileHash
                    {
                        Hash = metaData.Hash,
                        Path = relativePath
                    });
                }
            }

            await dbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Trace.WriteLine(e.Message);
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }

        return await AddFileRecordAsync(uploadId);
    }

    public static async Task<DataBase.Models.File> AddFileRecordAsync(string uploadId)
    {
        var metaData = MetadataCacheService.Get(uploadId);

        var dbContext = new DatabaseContext();

        var fileEntity = new DataBase.Models.File()
        {
            Key = uploadId + "_" + metaData.Name,
            Name = metaData.Name,
            Hash = metaData.Hash,
            Size = metaData.Size,
            FolderPath = SeparatorConverter.ConvertToDatabaseSeparator(metaData.FolderPath),
            ContentType = metaData.ContentType,
            Ext = metaData.Ext,
            Uploader = metaData.Uploader,
            CreatedAt = ConvertDateTimeToTimestamp(DateTime.Now)
        };

        try
        {
            await dbContext.Files.AddAsync(fileEntity);
            await dbContext.SaveChangesAsync();
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }

        return fileEntity;
    }

    public static async Task<string> CopyServerFileToArsenalFolder(string uploader, string localFilePath,
        UploadServerFolderParam param)
    {
        var destDirectory = Path.Combine(Configuration.Configuration.UploadFolderPath, param.FolderPath);

        var destFileName = Path.Combine(destDirectory, param.Name);

        if (!Directory.Exists(destDirectory))
        {
            Directory.CreateDirectory(destDirectory);
        }

        File.Copy(localFilePath, destFileName);

        var fileEntity = new DataBase.Models.File()
        {
            Key = Guid.NewGuid() + "_" + param.Name,
            Name = param.Name,
            Hash = null,
            Size = param.Size,
            FolderPath = SeparatorConverter.ConvertToDatabaseSeparator(param.FolderPath),
            ContentType = "",
            Ext = param.Ext,
            Uploader = uploader,
            CreatedAt = ConvertDateTimeToTimestamp(DateTime.Now)
        };

        var dbContext = new DatabaseContext();

        try
        {
            await dbContext.Files.AddAsync(fileEntity);
            await dbContext.SaveChangesAsync();
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }

        return fileEntity.Key;
    }

    public static async Task<string[]> UploadServerFolderAsync(string uploader, List<UploadServerFolderParam> data)
    {
        var list = new List<DataBase.Models.File>();

        foreach (var item in data)
        {
            var fileEntity = new DataBase.Models.File()
            {
                Key = Guid.NewGuid() + "_" + item.Name,
                Name = item.Name,
                Hash = null,
                Size = item.Size,
                FolderPath = SeparatorConverter.ConvertToDatabaseSeparator(item.FolderPath),
                ContentType = "",
                Ext = item.Ext,
                Uploader = uploader,
                CreatedAt = ConvertDateTimeToTimestamp(DateTime.Now)
            };

            list.Add(fileEntity);
        }

        var dbContext = new DatabaseContext();

        try
        {
            await dbContext.Files.AddRangeAsync(list);
            await dbContext.SaveChangesAsync();
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }

        return list.Select(item => item.Key).ToArray();
    }

    public static async Task<string> CreateFileDownloadLink(CreateFileDownloadLinkParam param)
    {
        var filePath = param.FilePath;

        var fileName = !string.IsNullOrWhiteSpace(param.DownloadFileName)
            ? param.DownloadFileName
            : Path.GetFileName(param.FilePath);

        var fileKey = Configuration.Configuration.TemporaryLinkPrefix + Guid.NewGuid().ToString()[3..] + "_" + fileName;

        if (param.CreateCopy)
        {
            var destFileName = Path.Combine(Configuration.Configuration.TemporaryDownloadFolderPath, fileKey);

            if (!Directory.Exists(Path.GetDirectoryName(destFileName)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(destFileName) ?? string.Empty);
            }

            File.Copy(param.FilePath, destFileName);
            filePath = destFileName.Replace(Configuration.Configuration.TemporaryDownloadFolderPath + "\\",
                string.Empty);
        }

        var dbContext = new DatabaseContext();

        try
        {
            var expirationAt =
                ConvertDateTimeToTimestamp(
                    DateTime.Now.AddMinutes(param.ExpirationDate == 0 ? long.MaxValue : param.ExpirationDate));

            dbContext.TemporaryDownloadFiles.Add(new TemporaryDownloadFile()
            {
                Key = fileKey,
                Path = filePath,
                HasCopy = param.CreateCopy,
                ExpirationAt = expirationAt
            });

            await dbContext.SaveChangesAsync();
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }

        return fileKey;
    }


    public static string GenerateUniqueFileName()
    {
        while (true)
        {
            var name = Guid.NewGuid().ToString();

            var filePath = Path.Combine(Configuration.Configuration.UploadFolderPath, name);

            if (File.Exists(filePath))
            {
                continue;
            }

            return name;
        }
    }

    /// <summary>
    /// 获取文件的文件夹
    /// </summary>
    /// <param name="fileId"></param>
    /// <returns></returns>
    public static string GetFileDirectory(string fileId)
    {
        return null;
    }

    /// <summary>
    /// 根据文件ID获取文件的全路径
    /// </summary>
    /// <param name="fileKey"></param>
    /// <returns></returns>
    public static async Task<string> GetFileFullPathByFileKeyAsync(string fileKey)
    {
        var dbContext = new DatabaseContext();

        try
        {
            // 可能是临时下载文件
            if (fileKey.StartsWith(Configuration.Configuration.TemporaryLinkPrefix))
            {
                var temporaryDownloadFile =
                    await dbContext.TemporaryDownloadFiles.FirstOrDefaultAsync(item => item.Key == fileKey);

                if (temporaryDownloadFile != null)
                {
                    var now = ConvertDateTimeToTimestamp(DateTime.Now);

                    if (temporaryDownloadFile.ExpirationAt < now)
                    {
                        return null;
                    }

                    if (temporaryDownloadFile.HasCopy)
                    {
                        return Path.Combine(Configuration.Configuration.TemporaryDownloadFolderPath,
                            SeparatorConverter.ConvertToSystemSeparator(temporaryDownloadFile.Path));
                    }

                    return temporaryDownloadFile.Path;
                }
            }

            var file = await dbContext.Files.FirstOrDefaultAsync(item => item.Key == fileKey);

            if (file == null)
            {
                var tempFilePath = Path.Combine(Configuration.Configuration.AppConfig.LocalUploadFolderPath, "Temp",
                    fileKey);

                if (File.Exists(tempFilePath))
                {
                    return tempFilePath;
                }

                var filePath = Path.Combine(Configuration.Configuration.AppConfig.LocalUploadFolderPath, fileKey);

                return File.Exists(filePath) ? filePath : null;
            }

            if (!string.IsNullOrWhiteSpace(file.Hash))
            {
                var fileHash = await dbContext.FileHashes.FirstOrDefaultAsync(item => item.Hash == file.Hash);

                if (fileHash == null)
                {
                    return null;
                }

                return Path.Combine(Configuration.Configuration.UploadFolderPath,
                    SeparatorConverter.ConvertToSystemSeparator(fileHash.Path));
            }

            return Path.Combine(Configuration.Configuration.UploadFolderPath,
                SeparatorConverter.ConvertToSystemSeparator(file.FolderPath), file.Name);
        }
        catch (Exception e)
        {
            Trace.WriteLine(e.Message);
        }
        finally
        {
            _ = dbContext.DisposeAsync();
        }

        return null;
    }

    /// <summary>
    /// 根据文件路径获取文件流
    /// </summary>
    /// <param name="filePath"></param>
    /// <returns></returns>
    public static Stream GetFileStreamByFilePath(string filePath)
    {
        return File.Exists(filePath) ? new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read) : null;
    }

    /// <summary>
    /// 删除文件
    /// </summary>
    /// <param name="fileKey"></param>
    public static async Task DeleteFileAsync(string fileKey)
    {
        var databaseContext = new DatabaseContext();

        try
        {
            var fileEntity = await databaseContext.Files.FirstOrDefaultAsync(item => item.Key == fileKey);

            if (fileEntity == null)
            {
                return;
            }

            var fileFullPath = await GetFileFullPathByFileKeyAsync(fileKey);

            databaseContext.Files.Remove(fileEntity);

            var needDeleteFile = true;

            if (!string.IsNullOrWhiteSpace(fileEntity.Hash))
            {
                var fileHashCount = await databaseContext.Files.CountAsync(item => item.Hash == fileEntity.Hash);

                if (fileHashCount == 1)
                {
                    var fileHash =
                        await databaseContext.FileHashes.FirstOrDefaultAsync(item => item.Hash == fileEntity.Hash);

                    databaseContext.FileHashes.Remove(fileHash);
                }
                else
                {
                    needDeleteFile = false;
                }
            }

            await databaseContext.SaveChangesAsync();

            if (!needDeleteFile)
            {
                return;
            }

            if (File.Exists(fileFullPath))
            {
                File.Delete(fileFullPath);
            }

            if (Configuration.Configuration.AppConfig.UseCloudStorage)
            {
                await CloudStorageService.DeleteFileAsync(fileFullPath);
            }
        }
        finally
        {
            _ = databaseContext.DisposeAsync();
        }
    }

    public static bool IsValidFileKey(string input)
    {
        if (input.Length < 37 || input[36] != '_')
        {
            return false;
        }

        if (!Guid.TryParse(input[..36], out _))
        {
            return false;
        }

        return !string.IsNullOrEmpty(input[37..]);
    }

    private static long ConvertDateTimeToTimestamp(DateTime dateTime)
    {
        var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var timestamp = (long)(dateTime.ToUniversalTime() - unixEpoch).TotalSeconds;
        return timestamp * 1000;
    }

    #endregion
}