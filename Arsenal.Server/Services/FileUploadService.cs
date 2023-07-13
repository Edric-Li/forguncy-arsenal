using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO.Compression;
using Arsenal.Server.Common;
using Arsenal.Server.Model.Params;
using Microsoft.AspNetCore.Http;
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

    public static async Task<bool> ExistsFileInUploadFolderAsync(string fileName)
    {
        var diskFilePath = DataAccess.DataAccess.Instance.GetDiskFile(fileName);

        if (diskFilePath == null)
        {
            return false;
        }

        var existsFile = ExistsFile(Path.Combine(Configuration.Configuration.UploadFolderPath, diskFilePath));

        if (!existsFile && Configuration.Configuration.AppConfig.UseCloudStorage)
        {
            existsFile =
                await CloudStorageService.FileExistsAsync(CloudStorageService.GetCloudStorageFilePath(diskFilePath));

            if (!existsFile)
            {
                DataAccess.DataAccess.Instance.DeleteDiskFile(fileName);
            }
        }

        return diskFilePath != null && existsFile;
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

        var tmpFile = Path.Combine(Configuration.Configuration.TempFolderPath, uploadId, ".merge");

        if (ExistsFile(tmpFile))
        {
            File.Delete(tmpFile);
        }

        if (parts.Count == 1)
        {
            return GetPartFilePath(uploadId, 0);
        }

        var fs = new FileStream(tmpFile, FileMode.OpenOrCreate);
        await MergeFileByParts(parts, fs, uploadId);
        fs.Close();

        return tmpFile;
    }

    public static string GetDestFilePathByUploadId(string uploadId)
    {
        // 获取元数据
        var metadata = MetadataManagement.Get(uploadId);

        // 获取目标文件夹,如果元数据中没有目标文件夹的话，那么就使用当前日期作为目标文件夹
        var targetFolderPath = metadata?.TargetFolder ?? GetCurrentDateFolder();

        // 获取文件名，如果元数据中没有文件名的话，那么就使用uploadId作为文件名
        var fileName = metadata?.FileName ?? uploadId;

        // 根据文件名和目标文件夹获取绝对路径
        string GetAbsolutePath(string filename) =>
            Path.Combine(Configuration.Configuration.UploadFolderPath, targetFolderPath, filename);

        var targetFilePath = GetAbsolutePath(fileName);

        if (!ExistsFile(targetFilePath))
        {
            return targetFilePath;
        }

        switch (metadata?.ConflictStrategy)
        {
            case ConflictStrategy.Overwrite:
                File.Delete(targetFilePath);
                break;

            case ConflictStrategy.Rename:
                var num = 1;
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                var extension = Path.GetExtension(fileName);

                string GetFilePath() => GetAbsolutePath($"{fileNameWithoutExtension}({num}){extension}");

                while (ExistsFile(GetFilePath()))
                {
                    num++;
                }

                return GetFilePath();

            default:
                throw new Exception($"文件夹{metadata.TargetFolder}下存在同名文件{metadata.FileName}。");
        }

        return targetFilePath;
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

    private static void CleanUpFileJunkFiles(string tmpFile, string fileName)
    {
        try
        {
            File.Delete(tmpFile);
            Directory.Delete(Path.Combine(Configuration.Configuration.TempFolderPath, fileName), true);
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

    public static List<int> ListParts(string fileName)
    {
        var folderPath = Path.Combine(Configuration.Configuration.TempFolderPath, fileName);

        return !Directory.Exists(folderPath)
            ? new List<int>()
            : Directory.GetFiles(folderPath).Select(fullPath => Convert.ToInt32(Path.GetFileName(fullPath))).ToList();
    }

    public static async Task UploadPartAsync(string uploadId, int partNumber, IFormFile file)
    {
        var folderPath = Path.Combine(Configuration.Configuration.TempFolderPath, uploadId);
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

    public static async Task<string> CompleteMultipartUploadAsync(string uploadId)
    {
        if (CompositeTaskMap.TryGetValue(uploadId, out var result))
        {
            var filePath = await result;

            if (File.Exists(filePath))
            {
                return filePath;
            }

            CompositeTaskMap.TryRemove(uploadId, out _);
        }

        return await CompositeTaskMap.GetOrAdd(uploadId, async x =>
        {
            var diskFile = DataAccess.DataAccess.Instance.GetDiskFile(uploadId);

            if (diskFile != null)
            {
                var fileFullPath = Path.Combine(Configuration.Configuration.UploadFolderPath, diskFile);

                if (File.Exists(fileFullPath))
                {
                    return fileFullPath;
                }
            }

            var mergedFilePath = await MergeFileAsync(uploadId);

            var targetFilePath = GetDestFilePathByUploadId(uploadId);

            MoveTemporaryFileToFinalDirectory(mergedFilePath, targetFilePath);

            DataAccess.DataAccess.Instance.PutDiskFile(uploadId,
                targetFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", string.Empty));

            CleanUpFileJunkFiles(mergedFilePath, uploadId);

            if (Configuration.Configuration.AppConfig.UseCloudStorage)
            {
                _ = CloudStorageService.CreateTaskAsync(
                    targetFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", string.Empty));
            }

            return targetFilePath;
        });

    }

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

        DataAccess.DataAccess.Instance.PutDownloadFile(fileId, filePath, param.ExpirationDate);

        return fileId;
    }

    public static string CreateSoftLink(string uploadId, string fileName)
    {
        var fileId = Guid.NewGuid() + "_" + fileName;

        DataAccess.DataAccess.Instance.PutVirtualFile(fileId, uploadId);

        return fileId;
    }

    public static Dictionary<string, string> GetDiskFiles()
    {
        return DataAccess.DataAccess.Instance.GetDiskFiles();
    }

    public static Dictionary<string, string> GetSoftLinksFiles()
    {
        return DataAccess.DataAccess.Instance.GetSoftLinksFiles();
    }

    public static Dictionary<string, string> GetDownloadLinksFiles()
    {
        return DataAccess.DataAccess.Instance.GetDownloadLinksFiles();
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
        var virtualFile = DataAccess.DataAccess.Instance.GetVirtualFile(fileId);

        if (virtualFile != null)
        {
            var diskFile = DataAccess.DataAccess.Instance.GetDiskFile(virtualFile);

            if (diskFile != null)
            {
                return Path.GetDirectoryName(diskFile);
            }
        }

        return null;
    }

    /// <summary>
    /// 根据文件ID获取文件的全路径
    /// </summary>
    /// <param name="fileId"></param>
    /// <returns></returns>
    public static string GetFileFullPathByFileId(string fileId)
    {
        var virtualFile = DataAccess.DataAccess.Instance.GetVirtualFile(fileId);

        if (virtualFile != null)
        {
            var diskFile = DataAccess.DataAccess.Instance.GetDiskFile(virtualFile);
            if (diskFile != null)
            {
                return Path.Combine(Configuration.Configuration.UploadFolderPath, diskFile);
            }
        }

        var downloadLinkEntity = DataAccess.DataAccess.Instance.GetDownloadFile(fileId);

        if (downloadLinkEntity != null)
        {
            var notCopyFile = false;
            var filePath = Path.Combine(Configuration.Configuration.DownloadFolderPath, fileId);

            if (!File.Exists(filePath))
            {
                notCopyFile = true;
                filePath = downloadLinkEntity.FilePath;
            }

            // 已过期
            if (downloadLinkEntity.ExpiresAt < DateTime.Now.Ticks)
            {
                if (File.Exists(filePath) && !notCopyFile)
                {
                    File.Delete(filePath);
                }

                DataAccess.DataAccess.Instance.DeleteDownloadFile(fileId);

                return null;
            }

            return filePath;
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

                var fullPath = GetFileFullPathByFileId(fileId);
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

    #endregion
}