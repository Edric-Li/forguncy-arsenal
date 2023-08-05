using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Arsenal.Server.Common;
using Arsenal.Server.Converters;
using Microsoft.AspNetCore.Http;

namespace Arsenal.Server.Services;

/// <summary>
/// 文件转换服务
/// </summary>
public class FileConvertService
{
    /// <summary>
    /// 支持CAD文件的后缀名
    /// </summary>
    private static readonly HashSet<string> SupportedCadFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        "dxf",
        "dwg",
        "dgn",
        "dwf",
        "dwfx",
        "dxb",
        "dwt",
        "plt",
        "cf2",
        "obj",
        "fbx",
        "collada",
        "stl",
        "stp",
        "ifc",
        "iges",
        "3ds"
    };

    /// <summary>
    /// 支持Office文件的后缀名
    /// </summary>
    private static readonly HashSet<string> SupportedOfficeFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        "ppt",
        "pptx",
        "xls",
        "doc",
        "docx",
    };

    /// <summary>
    /// 转换任务
    /// </summary>
    private static readonly ConcurrentDictionary<string, Task<string>> ConvertingTasks = new();

    /// <summary>
    /// 转换锁
    /// </summary>
    private static readonly object ConvertingTaskLockObj = new();

    /// <summary>
    /// 静态构造函数
    /// </summary>
    static FileConvertService()
    {
        if (!Directory.Exists(Configuration.Configuration.ConvertedFolderPath))
        {
            Directory.CreateDirectory(Configuration.Configuration.ConvertedFolderPath);
        }
    }

    /// <summary>
    /// 将字符串转换为Guid
    /// 首先将字符串转换为MD5，然后将MD5转换为Guid
    /// </summary>
    /// <param name="inputString"></param>
    /// <returns></returns>
    private static string ConvertToGuidByString(string inputString)
    {
        using var md5 = MD5.Create();
        var inputBytes = Encoding.UTF8.GetBytes(inputString);
        var hashBytes = md5.ComputeHash(inputBytes);

        var sb = new StringBuilder();
        foreach (var t in hashBytes)
        {
            sb.Append(t.ToString("x2")); // 将每个字节转换为 2 位的十六进制字符串
        }

        var md5Hash = sb.ToString();

        var md5Bytes = new byte[16];
        Buffer.BlockCopy(Guid.Parse(md5Hash).ToByteArray(), 0, md5Bytes, 0, 16);
        var guid = new Guid(md5Bytes);

        return guid.ToString();
    }

    /// <summary>
    /// 根据系统安装的转换器，获取可以转换的文件后缀名
    /// </summary>
    /// <returns></returns>
    public static HashSet<string> GetConvertableFileExtensions()
    {
        var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (PptConverter.IsInstalled)
        {
            result.Add("ppt");
            result.Add("pptx");
        }

        if (ExcelConverter.IsInstalled)
        {
            result.Add("xls");
        }

        if (WordConverter.IsInstalled)
        {
            result.Add("doc");
            result.Add("docx");
        }

        return result;
    }
    
    /// <summary>
    /// 尝试转换文件
    /// </summary>
    /// <returns></returns>
    private static bool ConvertFileAsync(string inputFile, string outputFile)
    {
        var extension = Path.GetExtension(inputFile).ToLower().TrimStart('.');

        if (!SupportedOfficeFileExtensions.Contains(extension) && !SupportedCadFileExtensions.Contains(extension))
        {
            return false;
        }

        if (extension.StartsWith("ppt"))
        {
            if (!PptConverter.IsInstalled)
            {
                return false;
            }

            new PptConverter(inputFile, outputFile).ConvertToPdf();
            
            return true;
        }

        if (extension == "xls")
        {
            if (!ExcelConverter.IsInstalled)
            {
                return false;
            }

            new ExcelConverter(inputFile, outputFile).ConvertToXlsx();
            return true;
        }

        if (extension.StartsWith("doc"))
        {
            if (!WordConverter.IsInstalled)
            {
                return false;
            }

            new WordConverter(inputFile, outputFile).ConvertToPdf();
            return true;
        }

        if (SupportedCadFileExtensions.Contains(extension))
        {
            new CadConverter(inputFile, outputFile).ConvertToPdf();
            return true;
        }

        return false;
    }

    /// <summary>
    /// 获取转换后的文件-工厂方法
    /// </summary>
    /// <param name="url"></param>
    /// <param name="targetFileType"></param>
    /// <param name="forceUpdate"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    private static async Task<string> GetConvertedFileFactoryAsync(string url, string targetFileType, bool forceUpdate)
    {
        if (url is null || targetFileType is null)
        {
            throw new ArgumentNullException();
        }

        var fileName = Path.GetFileName(new Uri(url).LocalPath);

        var isInnerFile = FileUploadService.IsValidFileKey(fileName);

        // 如果url不是内部文件，需要将其转换成内部文件的key
        if (!isInnerFile)
        {
            fileName = ConvertToGuidByString(fileName) + "_" + fileName;
        }

        var convertedFileName = Path.GetFileNameWithoutExtension(fileName) + "." + targetFileType;

        var convertedFilePath = Path.Combine(Configuration.Configuration.ConvertedFolderPath, convertedFileName);

        if (File.Exists(convertedFilePath))
        {
            if (forceUpdate)
            {
                File.Delete(convertedFilePath);
            }
            else
            {
                return convertedFilePath;
            }
        }

        var inputFilePath = string.Empty;

        if (isInnerFile)
        {
            inputFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileName);

            if (!File.Exists(inputFilePath))
            {
                inputFilePath = Path.Combine(Configuration.Configuration.TempFolderPath, fileName);
            }

            if (!File.Exists(inputFilePath))
            {
                if (Configuration.Configuration.AppConfig.UseCloudStorage)
                {
                    await CloudStorageService.DownloadFileToLocalAsync(inputFilePath, inputFilePath);
                }
            }
        }
        else
        {
            await DownloadFileAsync(url, inputFilePath);
        }

        if (inputFilePath == string.Empty || !File.Exists(inputFilePath))
        {
            throw new Exception("文件不存在");
        }

        if (!ConvertFileAsync(inputFilePath, convertedFilePath))
        {
            throw new Exception("文件转换失败");
        }

        return convertedFilePath;
    }

    /// <summary>
    /// 创建或获取转换任务
    /// </summary>
    /// <param name="url"></param>
    /// <param name="targetFileType"></param>
    /// <param name="forceUpdate"></param>
    /// <returns></returns>
    private static Task<string> CreateOrGetConvertingTaskAsync(string url, string targetFileType, bool forceUpdate)
    {
        var key = url + targetFileType;

        lock (ConvertingTaskLockObj)
        {
            if (ConvertingTasks.TryGetValue(key, out var task) && !task.IsCompleted && !task.IsFaulted &&
                !task.IsCanceled && !forceUpdate)
            {
                return task;
            }

            ConvertingTasks.TryRemove(key, out _);
        }

        lock (ConvertingTaskLockObj)
        {
            if (!ConvertingTasks.ContainsKey(key))
            {
                ConvertingTasks[key] = GetConvertedFileFactoryAsync(url, targetFileType, forceUpdate);
            }
        }

        lock (ConvertingTaskLockObj)
        {
            return ConvertingTasks[key];
        }
    }

    /// <summary>
    /// 创建转换任务
    /// </summary>
    /// <param name="context"></param>
    public static async Task CreateFileConversionTask(HttpContext context)
    {
        await GetConvertedFileAsync(context, false);
    }

    /// <summary>
    /// 获取转换后的文件
    /// </summary>
    /// <param name="context"></param>
    /// <param name="needResponseFileStream"></param>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    public static async Task GetConvertedFileAsync(HttpContext context, bool needResponseFileStream = true)
    {
        var url = HttpUtility.UrlDecode(context.Request.Query["url"].ToString());
        var targetFileType = HttpUtility.UrlDecode(context.Request.Query["target-type"].ToString());
        var forceUpdate = context.Request.Query["force-updated"].ToString();

        var filePath = await CreateOrGetConvertingTaskAsync(url, targetFileType, forceUpdate == "true");

        // 如果文件不存在，且强制更新为false，则重新创建任务
        if (!File.Exists(filePath) && forceUpdate != "true")
        {
            filePath = await CreateOrGetConvertingTaskAsync(url, targetFileType, true);
        }

        // 请求未取消，且需要返回文件流时才返回文件流
        if (!context.RequestAborted.IsCancellationRequested && needResponseFileStream)
        {
            await context.ResponseStreamByFilePathAsync(filePath);
        }
    }

    /// <summary>
    /// 下载文件
    /// </summary>
    /// <param name="url"></param>
    /// <param name="filePath"></param>
    private static async Task DownloadFileAsync(string url, string filePath)
    {
        var response = await HttpClientHelper.Client.GetAsync(url);
        var stream = await response.Content.ReadAsStreamAsync();
        await using var outputStream = new FileStream(filePath, FileMode.Create);
        await stream.CopyToAsync(outputStream);
    }
}