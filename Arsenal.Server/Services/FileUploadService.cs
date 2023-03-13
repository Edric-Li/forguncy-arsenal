using System.Diagnostics;
using Arsenal.WebApi.Common;
using Arsenal.WebApi.Model.Params;
using Microsoft.AspNetCore.Http;
using File = System.IO.File;

namespace Arsenal.WebApi.Services;

internal static class FileUploadService
{
    #region Private Method

    private static bool ExistsFile(string filePath)
    {
        return File.Exists(filePath);
    }

    public static bool ExistsFileInDiskFilesDb(string fileName)
    {
        var diskFilePath = DataAccess.DataAccess.Instance.GetDiskFile(fileName);

        return diskFilePath != null &&
               ExistsFile(Path.Combine(Configuration.Configuration.UploadFolderPath, diskFilePath));
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
                throw new Exception("The file already exists.");
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

        return !Directory.Exists(folderPath) ? new List<int>() : Directory.GetFiles(folderPath).Select(fullPath => Convert.ToInt32(Path.GetFileName(fullPath))).ToList();
    }

    public static async Task UploadPartAsync(string uploadId, int partNumber, IFormFile file)
    {
        var folderPath = Path.Combine(Configuration.Configuration.TempFolderPath, uploadId);

        await CopyStreamAsync(file.OpenReadStream(), Path.Combine(folderPath, partNumber.ToString()));
    }

    public static async Task<string> CompleteMultipartUploadAsync(string uploadId)
    {
        var mergedFilePath = await MergeFileAsync(uploadId);

        var targetFilePath = GetDestFilePathByUploadId(uploadId);

        MoveTemporaryFileToFinalDirectory(mergedFilePath, targetFilePath);

        DataAccess.DataAccess.Instance.PutDiskFile(uploadId,
            targetFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", string.Empty));

        CleanUpFileJunkFiles(mergedFilePath, uploadId);

        return targetFilePath;
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

    #endregion
}