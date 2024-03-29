﻿using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Arsenal.Server.Common;
using Arsenal.Server.Converters;
using Arsenal.Server.Model;

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
    /// 支持转换的Word文件的后缀名
    /// </summary>
    private static readonly HashSet<string> SupportedWordFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        "doc",
        "docx",
    };

    /// <summary>
    /// 支持转换的PowerPoint文件的后缀名
    /// </summary>
    private static readonly HashSet<string> SupportedPowerPointFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        "ppt",
        "pptx",
    };

    /// <summary>
    /// 支持转换的Excel文件的后缀名
    /// </summary>
    private static readonly HashSet<string> SupportedExcelFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        "xls",
        "csv",
    };

    /// <summary>
    /// 支持转换的视频文件的后缀名
    /// </summary>
    private static readonly HashSet<string> SupportedVideoFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        "mp4",
        "avi",
        "wmv",
        "mov",
        "flv",
        "mkv",
        "rmvb",
        "rm",
        "3gp",
        "mpeg",
        "mpg",
        "vob",
        "swf",
        "asf",
        "m4v",
        "f4v",
        "dat",
        "mts",
        "m2ts",
        "mxf",
        "m2v",
        "3g2",
        "3gp2",
        "3gpp",
        "3gpp2",
        "dv",
        "divx",
        "xvid",
        "264",
        "h264",
        "h265",
        "hevc",
        "vp8",
        "vp9",
        "webm",
        "ogv",
        "ogg",
        "dvd"
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
    public static async Task<HashSet<string>> GetConvertableFileExtensionsAsync()
    {
        var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (await PptConverter.CheckInstalledAsync())
        {
            result.UnionWith(SupportedPowerPointFileExtensions);
        }

        if (await ExcelConverter.CheckInstalledAsync())
        {
            result.UnionWith(SupportedExcelFileExtensions);
        }

        if (await WordConverter.CheckInstalledAsync())
        {
            result.UnionWith(SupportedWordFileExtensions);
        }

        if (await VideoConverter.CheckInstalledAsync())
        {
            result.UnionWith(SupportedVideoFileExtensions);
        }

        return result;
    }

    /// <summary>
    /// 尝试转换文件
    /// </summary>
    /// <returns></returns>
    private static async Task<bool> ConvertFileAsync(string inputFile, string outputFile)
    {
        var extension = Path.GetExtension(inputFile).ToLower().TrimStart('.');

        if (SupportedPowerPointFileExtensions.Contains(extension))
        {
            await new PptConverter(inputFile, outputFile).ConvertToPdfAsync();
            return true;
        }

        if (SupportedExcelFileExtensions.Contains(extension))
        {
            await new ExcelConverter(inputFile, outputFile).ConvertToXlsxAsync();
            return true;
        }

        if (SupportedWordFileExtensions.Contains(extension))
        {
            await new WordConverter(inputFile, outputFile).ConvertToPdfAsync();
            return true;
        }

        if (SupportedCadFileExtensions.Contains(extension))
        {
            if (ZWCadConverter.IsInstalled)
            {
                await new ZWCadConverter(inputFile, outputFile).ConvertToPdfAsync();
                return true;
            }
        }

        if (SupportedVideoFileExtensions.Contains(extension))
        {
            await new VideoConverter(inputFile, outputFile).ConvertToH264Async();
            return true;
        }

        return false;
    }

    /// <summary>
    /// 获取转换后的文件路径
    /// </summary>
    /// <param name="url"></param>
    /// <param name="targetFileType"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    private static string GetConvertedFilePath(string url, string targetFileType)
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

        var convertedFileName = fileName.Substring(0, 36) + "." + targetFileType;

        var convertedFilePath = Path.Combine(Configuration.Configuration.ConvertedFolderPath, convertedFileName);

        return convertedFilePath;
    }

    /// <summary>
    /// 转换后的文件是否存在
    /// </summary>
    /// <param name="url"></param>
    /// <param name="targetFileType"></param>
    /// <returns></returns>
    public static bool ConvertedFileExists(string url, string targetFileType)
    {
        var convertedFilePath = GetConvertedFilePath(url, targetFileType);

        return File.Exists(convertedFilePath);
    }

    /// <summary>
    /// 获取转换后的文件-工厂方法
    /// </summary>
    /// <returns></returns>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    private static async Task<string> GetConvertedFileFactoryAsync(ConvertFileArgs convertFileArgs)
    {
        if (convertFileArgs.Url is null || convertFileArgs.TargetFileType is null)
        {
            throw new ArgumentNullException();
        }

        var fileName = Path.GetFileName(new Uri(convertFileArgs.Url).LocalPath);

        var isInnerFile = FileUploadService.IsValidFileKey(fileName);

        var convertedFilePath = GetConvertedFilePath(convertFileArgs.Url, convertFileArgs.TargetFileType);

        var fileExists = ConvertedFileExists(convertFileArgs.Url, convertFileArgs.TargetFileType);

        if (fileExists)
        {
            if (convertFileArgs.ForceUpdated)
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
            await DownloadFileAsync(convertFileArgs.Url, inputFilePath);
        }

        if (inputFilePath == string.Empty || !File.Exists(inputFilePath))
        {
            throw new Exception("文件不存在");
        }

        // 如果输入文件不在临时文件夹，需要将其复制到临时文件夹，避免转换时出现文件占用，导致发布失败
        if (Configuration.Configuration.RunAtLocal &&
            Path.GetDirectoryName(inputFilePath) != Configuration.Configuration.TempFolderPath)
        {
            try
            {
                File.Copy(inputFilePath, Path.Combine(Configuration.Configuration.TempFolderPath, fileName), true);
            }
            catch (Exception e)
            {
                Logger.Error("将文件移动到临时目录失败", e);
            }
        }

        if (!await ConvertFileAsync(inputFilePath, convertedFilePath))
        {
            throw new Exception("文件转换失败");
        }

        return convertedFilePath;
    }

    /// <summary>
    /// 创建或获取转换任务
    /// </summary>
    /// <param name="convertFileArgs"></param>
    /// <returns></returns>
    private static Task<string> CreateOrGetConvertingTaskAsync(ConvertFileArgs convertFileArgs)
    {
        var key = convertFileArgs.Url + convertFileArgs.TargetFileType;

        lock (ConvertingTaskLockObj)
        {
            if (ConvertingTasks.TryGetValue(key, out var task) && !task.IsCompleted && !task.IsFaulted &&
                !task.IsCanceled && !convertFileArgs.ForceUpdated)
            {
                return task;
            }

            ConvertingTasks.TryRemove(key, out _);
        }

        lock (ConvertingTaskLockObj)
        {
            if (!ConvertingTasks.ContainsKey(key))
            {
                ConvertingTasks[key] = GetConvertedFileFactoryAsync(convertFileArgs);
            }
        }

        lock (ConvertingTaskLockObj)
        {
            return ConvertingTasks[key];
        }
    }

    /// <summary>
    /// 从context中提取ConvertFileParam
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public static ConvertFileArgs GetConvertFileArgsFromContext(HttpContext context)
    {
        var param = new ConvertFileArgs();

        var argsMap = new Dictionary<string, string>();
        var str = HttpUtility.UrlDecode(context.Request.Path.Value!.Split("/").Last());

        str.Split("&").ToList().ForEach(s =>
        {
            var kv = s.Split("=");
            argsMap.Add(kv[0], kv[1]);
        });

        param.Url = HttpUtility.UrlDecode(argsMap["url"]);
        param.TargetFileType = HttpUtility.UrlDecode(argsMap["target-type"]);
        param.ForceUpdated = argsMap["force-updated"] == "true";

        return param;
    }
    
    /// <summary>
    /// 创建转换任务
    /// </summary>
    /// <param name="context"></param>
    public static async Task CreateFileConversionTask(HttpContext context)
    {
        await GetConvertedFileAsync(context);
    }

    /// <summary>
    /// 获取转换后的文件
    /// </summary>
    /// <param name="context"></param>
    /// <exception cref="ArgumentNullException"></exception>
    /// <exception cref="Exception"></exception>
    public static async Task<string> GetConvertedFileAsync(
        HttpContext context)
    {
        var convertFileArg = GetConvertFileArgsFromContext(context);

        return await CreateOrGetConvertingTaskAsync(convertFileArg);
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