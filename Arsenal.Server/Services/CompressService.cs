using System.IO.Compression;

namespace Arsenal.Server.Services;

/// <summary>
/// 压缩服务
/// </summary>
public abstract class CompressService
{
    /// <summary>
    /// 将文件压缩成Zip
    /// </summary>
    /// <param name="zipFilePath">压缩文件路径</param>
    /// <param name="filesToCompress">需要压缩的文件</param>
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

                var fullPath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileId);
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

    /// <summary>
    /// 解压Zip文件
    /// </summary>
    /// <param name="zipFilePath">zip文件路径</param>
    /// <param name="extractPath">目标文件夹</param>
    public static void ExtractToDirectory(string zipFilePath, string extractPath)
    {
        ZipFile.ExtractToDirectory(zipFilePath, extractPath);
    }
}