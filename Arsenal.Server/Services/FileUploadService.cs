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
using File = System.IO.File;

namespace Arsenal.Server.Services;

public static class FileUploadService
{
    #region Private Method

    private static readonly ConcurrentDictionary<string, Task<string>> CompositeTaskMap = new();

    private static bool ExistsFile(string filePath)
    {
        return File.Exists(filePath);
    }

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

            if (item == null)
            {
                return false;
            }

            relativePath = item.Path;
        }

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

        var folderName = MetadataCacheService.Get(uploadId).Hash ?? uploadId;

        var tmpFile = Path.Combine(Configuration.Configuration.TempFolderPath, folderName, ".merge");

        if (ExistsFile(tmpFile))
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
                break;

            case ConflictStrategy.Rename:
                var num = 1;
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(metadata.Name);
                var extension = Path.GetExtension(metadata.Name);

                string GetNextFileName() => $"{fileNameWithoutExtension}({num}){extension}";

                while (true)
                {
                    var nextFileName = GetNextFileName();

                    var fileEntity2 = await dbContext.Files.FirstOrDefaultAsync(
                        i => i.FolderPath == metadata.FolderPath && i.Name == nextFileName);

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

        return null;
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

        if (!ExistsFile(targetFilePath))
        {
            return targetFilePath;
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

                while (ExistsFile(nextFilePath))
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
        var mergedFilePath = await MergeFileAsync(uploadId);

        var metaData = MetadataCacheService.Get(uploadId);

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
            _ = CloudStorageService.CreateTaskAsync(
                targetFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", string.Empty));
        }

        var dbContext = new DatabaseContext();

        if (!string.IsNullOrWhiteSpace(metaData.Hash))
        {
            dbContext.FileHashes.Add(new FileHash
            {
                Hash = metaData.Hash,
                Path = relativePath
            });
        }

        var fileEntity = new DataBase.Models.File()
        {
            Key = uploadId + "_" + metaData.Name,
            Name = metaData.Name,
            Hash = metaData.Hash,
            Size = metaData.Size,
            FolderPath = metaData.FolderPath,
            ContentType = metaData.ContentType,
            Ext = metaData.Ext,
            Uploader = metaData.Uploader,
        };

        await dbContext.Files.AddAsync(fileEntity);

        await dbContext.SaveChangesAsync();

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
            FolderPath = metaData.FolderPath,
            ContentType = metaData.ContentType,
            Ext = metaData.Ext,
            Uploader = metaData.Uploader,
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

    // todo 重构
    public static string CreateFileDownloadLink(CreateFileDownloadLinkParam param)
    {
        var filePath = param.FilePath;

        var fileName = Path.GetFileName(param.FilePath);
        var fileId = Guid.NewGuid() + "_" + fileName;

        if (param.CreateCopy)
        {
            var destFileName = Path.Combine(Configuration.Configuration.DownloadFolderPath, fileId);

            if (!Directory.Exists(Path.GetDirectoryName(destFileName)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(destFileName) ?? string.Empty);
            }

            File.Copy(param.FilePath, destFileName);
            filePath = destFileName.Replace(Configuration.Configuration.DownloadFolderPath + "\\", string.Empty);
        }

        return fileId;
    }


    public static string GenerateUniqueFileName()
    {
        while (true)
        {
            var name = Guid.NewGuid().ToString();

            var filePath = Path.Combine(Configuration.Configuration.UploadFolderPath, name);

            if (ExistsFile(filePath))
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

        var file = await dbContext.Files.FirstOrDefaultAsync(item => item.Key == fileKey);

        if (file == null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(file.Hash))
        {
            var fileHash = await dbContext.FileHashes.FirstOrDefaultAsync(item => item.Hash == file.Hash);

            if (fileHash == null)
            {
                return null;
            }

            return Path.Combine(Configuration.Configuration.UploadFolderPath, fileHash.Path);
        }

        return Path.Combine(Configuration.Configuration.UploadFolderPath, file.FolderPath, file.Name);
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
    /// 将文件压缩成Zip
    /// </summary>
    /// <param name="zipFilePath"></param>
    /// <param name="filesToCompress"></param>
    /// <param name="needKeepFolderStructure"></param>
    public static async Task CompressFilesToZipAsync(string zipFilePath, IEnumerable<string> filesToCompress,
        bool needKeepFolderStructure)
    {
        try
        {
            var directoryName = Path.GetDirectoryName(zipFilePath);

            if (!Directory.Exists(directoryName))
            {
                Directory.CreateDirectory(directoryName!);
            }

            await using var zipFile = new FileStream(zipFilePath, FileMode.Create);
            using var archive = new ZipArchive(zipFile, ZipArchiveMode.Create);
            var addedEntryNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var fileId in filesToCompress)
            {
                if (string.IsNullOrWhiteSpace(fileId))
                {
                    continue;
                }

                var fullPath = await GetFileFullPathByFileKeyAsync(fileId);
                if (fullPath == null)
                {
                    continue;
                }

                var entryName = fullPath.Replace(Configuration.Configuration.UploadFolderPath + "\\", "");

                if (!needKeepFolderStructure)
                {
                    entryName = Path.GetFileName(fullPath);

                    // 如果选择不保持文件夹结构，出现重名文件后，使用fileId做为文件名称
                    if (addedEntryNames.Contains(entryName))
                    {
                        entryName = fileId;
                    }
                }
                else
                {
                    if (addedEntryNames.Contains(entryName))
                    {
                        continue;
                    }
                }

                addedEntryNames.Add(entryName);

                var filePath = fullPath;

                if (!File.Exists(fileId))
                {
                    if (Configuration.Configuration.AppConfig!.UseCloudStorage)
                    {
                        await CloudStorageService.DownloadFileToLocalAsync(fullPath,
                            Configuration.Configuration.TempFolderPath);

                        filePath = Path.Combine(Configuration.Configuration.TempFolderPath,
                            Path.GetFileName(filePath));
                    }
                }

                archive.CreateEntryFromFile(filePath, entryName);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error compressing file: " + ex.Message);
        }
    }

    private static long ConvertDateTimeToTimestamp(DateTime dateTime)
    {
        var date = DateTime.Now;
        var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        long timestamp = (long)(date.ToUniversalTime() - unixEpoch).TotalSeconds;
        return timestamp * 1000;
    }

    public static List<ListItemModel> ListItems(string relativePath)
    {
        var folderPath = Path.Combine(Configuration.Configuration.UploadFolderPath, relativePath);
        if (!Directory.Exists(folderPath))
        {
            return new List<ListItemModel>(0);
        }

        var directory = new DirectoryInfo(folderPath);
        var subDirectories = directory.GetDirectories();
        var files = directory.GetFiles();

        var list = subDirectories.Select(item => new ListItemModel()
        {
            Name = item.Name,
            CreationTime = ConvertDateTimeToTimestamp(item.CreationTime),
            LastWriteTime = ConvertDateTimeToTimestamp(item.LastWriteTime),
            IsFolder = true
        }).ToList();

        list.AddRange(files.Select(item => new ListItemModel()
        {
            Name = item.Name,
            CreationTime = ConvertDateTimeToTimestamp(item.CreationTime),
            LastWriteTime = ConvertDateTimeToTimestamp(item.LastWriteTime),
            Size = item.Length,
            IsFolder = false
        }));

        return list;
    }

    #endregion
}