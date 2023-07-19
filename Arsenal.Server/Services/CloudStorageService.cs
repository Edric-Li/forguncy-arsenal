using System.Text;
using Arsenal.Server.Common;
using Arsenal.Server.DataBase;
using Arsenal.Server.Model;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Arsenal.Server.Services;

/// <summary>
/// 云存储相关服务
/// </summary>
public abstract class CloudStorageService
{
    /// <summary>
    /// 重试次数
    /// </summary>
    private const int RetryTimes = 3;

    /// <summary>
    /// 是否已经初始化
    /// </summary>
    private static bool _isInitialized;


    /// <summary>
    /// 确保初始化
    /// </summary>
    public static void EnsureInitialization()
    {
        if (_isInitialized)
        {
            return;
        }

        _isInitialized = true;

        _ = InitializeAsync();
    }

    /// <summary>
    /// 初始化
    /// </summary>
    private static async Task InitializeAsync()
    {
        if (!Configuration.Configuration.AppConfig.UseCloudStorage)
        {
            return;
        }

        var files = new HashSet<string>();

        var databaseContext = new DatabaseContext();

        var fileList = await databaseContext.Files.ToListAsync();
        var fileHashes = await databaseContext.FileHashes.ToListAsync();
        var fileHashesMap = fileHashes.ToDictionary(i => i.Hash, i => i.Path);

        //todo 有问题
        foreach (var file in fileList)
        {
            if (string.IsNullOrWhiteSpace(file.Hash))
            {
                files.Add(Path.Combine(file.FolderPath, file.Name));
            }
            else
            {
                if (fileHashesMap.TryGetValue(file.Hash, out var item))
                {
                    files.Add(item);
                }
            }
        }

        await ConcurrentExecutionAsync(5, files.ToList(),
            async i => { await RunUploadFileToCloudStorageTaskAsync(i); });
    }

    /// <summary>
    /// 转换路径为云存储格式
    /// </summary>
    /// <param name="path">路径</param>
    /// <returns></returns>
    private static string ConvertPathToCloudStorageFormat(string path)
    {
        return string.Join("/", path.Split(new[] { '\\', '/' }, StringSplitOptions.RemoveEmptyEntries));
    }

    /// <summary>
    /// 写日志
    /// </summary>
    /// <param name="message">信息</param>
    private static void WriteLog(string message)
    {
        Console.WriteLine("[ARSENAL-CloudStorageAttachmentFileProcessor] " + message);
    }

    /// <summary>
    /// 根据文件名获取云存储文件路径
    /// </summary>
    /// <param name="fileName">文件名称</param>
    /// <returns></returns>
    public static string GetCloudStorageFilePath(string fileName)
    {
        return ConvertPathToCloudStorageFormat(
            Path.Combine(Configuration.Configuration.AppConfig.CloudStorageUploadFolderPath, fileName));
    }

    /// <summary>
    /// 根据文件名获取本地文件路径
    /// </summary>
    /// <param name="fileName">文件名称</param>
    /// <returns></returns>
    private static string GetLocalFilePath(string fileName)
    {
        return Path.Combine(Configuration.Configuration.UploadFolderPath, fileName);
    }

    /// <summary>
    /// 并发执行
    /// </summary>
    /// <param name="concurrentCount">并发数量</param>
    /// <param name="data">数据源</param>
    /// <param name="func">需要执行的方法</param>
    /// <typeparam name="TSource"></typeparam>
    private static async Task ConcurrentExecutionAsync<TSource>(int concurrentCount, IEnumerable<TSource> data,
        Func<TSource, Task> func)
    {
        var tasks = new List<Task>();

        var semaphore = new SemaphoreSlim(concurrentCount);

        async Task InvokeFuncAsync(TSource item)
        {
            try
            {
                await func(item);
            }
            finally
            {
                semaphore.Release();
            }
        }

        foreach (var item in data)
        {
            await semaphore.WaitAsync();

            tasks.Add(InvokeFuncAsync(item));
        }

        await Task.WhenAll(tasks);
    }

    /// <summary>
    /// 创建上传任务
    /// </summary>
    /// <param name="filePath">文件路径（本地）</param>
    public static async Task CreateUploadTaskAsync(string filePath)
    {
        await RunUploadFileToCloudStorageTaskAsync(filePath);
    }

    /// <summary>
    /// 发送请求到UserService
    /// </summary>
    /// <param name="apiName">API名称</param>
    /// <param name="content">请求体</param>
    /// <returns></returns>
    private static async Task<HttpResponseMessage> SendRequestAsync(
        string apiName,
        object content = null)
    {
        var url = $"{Configuration.Configuration.AppConfig.UserServiceUrl}/CloudStorageProviderCommand/{apiName}";

        var request = new HttpRequestMessage(HttpMethod.Post, url);

        request.Headers.Add("AuthorizationName",
            Convert.ToBase64String(Encoding.UTF8.GetBytes(Configuration.Configuration.AppConfig.StorageType)));

        request.Content = new JsonContent(content);

        return await HttpClientHelper.Client.SendAsync(request);
    }

    /// <summary>
    /// 发送Json请求到UserService
    /// </summary>
    /// <param name="apiName">API名称</param>
    /// <param name="content">请求体</param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    private static async Task<ResultData> SendJsonRequestAsync(
        string apiName,
        object content = null)
    {
        var response = await SendRequestAsync(apiName, content);

        if (!response.IsSuccessStatusCode)
        {
            using var sr = new StreamReader(await response.Content.ReadAsStreamAsync());

            throw new Exception($"{response.StatusCode} {await sr.ReadToEndAsync()}");
        }

        var str = await response.Content.ReadAsStringAsync();

        var result = JsonConvert.DeserializeObject<ResultData>(str);

        if (result is { Result: false }) throw new Exception($"{apiName} Request failed!!! {result.Message}");

        return result;
    }

    /// <summary>
    /// 文件是否存在
    /// </summary>
    /// <param name="filePath">文件路径（云上）</param>
    /// <returns></returns>
    public static async Task<bool> FileExistsAsync(string filePath)
    {
        // 5 是枚举中 的 Exists
        var content = new Dictionary<string, object>
            { { "Path", ConvertPathToCloudStorageFormat(filePath) }, { "Type", 5 } };

        var result = await SendJsonRequestAsync("GetFileInformation", content);

        return (bool)result.Properties["Value"];
    }

    /// <summary>
    /// 将本地文件上传到云存储
    /// </summary>
    /// <param name="filePath">文件路径（本地）</param>
    /// <returns></returns>
    private static async Task<ResultData> UploadFileToCloudStorageAsync(string filePath)
    {
        var folder = Path.GetDirectoryName(filePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", ""));

        return await SendJsonRequestAsync("UploadFile", new Dictionary<string, object>
        {
            { "LocalFilePath", filePath },
            { "FolderPath", Path.Combine(Configuration.Configuration.AppConfig.CloudStorageUploadFolderPath, folder) }
        });
    }

    /// <summary>
    /// 运行上传文件到云存储任务
    /// </summary>
    /// <param name="fileName">文件名称</param>
    /// <param name="retryTime">重试次数</param>
    private static async Task RunUploadFileToCloudStorageTaskAsync(string fileName, int retryTime = 1)
    {
        var filePath = GetLocalFilePath(fileName);

        WriteLog($"[{fileName}] Start upload.({retryTime})");

        var deleteUploadMarkFile = false;

        try
        {
            if (await FileExistsAsync(GetCloudStorageFilePath(fileName)))
            {
                WriteLog($"[{fileName}] File already exists.");

                deleteUploadMarkFile = true;
            }
            else if (!File.Exists(filePath))
            {
                WriteLog(
                    $"[{fileName}] The file does not exist remotely, and the file does not exist locally.");

                deleteUploadMarkFile = true;
            }
            else
            {
                var uploadSuccess = (await UploadFileToCloudStorageAsync(filePath)).Result;

                deleteUploadMarkFile = uploadSuccess;
            }
        }
        catch (Exception e)
        {
            WriteLog(e.Message);
        }

        if (deleteUploadMarkFile)
        {
            File.Delete(filePath);
            WriteLog($"[{fileName}] Uploaded successfully.({retryTime})");
        }
        else
        {
            if (retryTime < RetryTimes)
            {
                WriteLog($"[{fileName}] Upload failed.({retryTime})");
                await RunUploadFileToCloudStorageTaskAsync(fileName, retryTime + 1);
            }
        }
    }

    /// <summary>
    /// 将云上的文件下载到本地
    /// </summary>
    /// <param name="filePath">文件路径（云上）</param>
    /// <param name="localFolderPath">本地的文件路径</param>
    /// <exception cref="Exception"></exception>
    public static async Task DownloadFileToLocalAsync(string filePath, string localFolderPath)
    {
        var folder =
            Path.GetDirectoryName(filePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", ""));
        var folderPath = Path.Combine(Configuration.Configuration.AppConfig.CloudStorageUploadFolderPath, folder);
        var cloudFilePath = Path.Combine(folderPath, Path.GetFileName(filePath));

        var content = new Dictionary<string, object>()
            { { "Path", cloudFilePath }, { "LocalFolderPath", localFolderPath } };

        var response = await SendRequestAsync("DownloadFile", content);

        if (!response.IsSuccessStatusCode)
        {
            using var sr = new StreamReader(await response.Content.ReadAsStreamAsync());

            throw new Exception($"{response.StatusCode} {await sr.ReadToEndAsync()}");
        }
    }

    /// <summary>
    /// 删除云上的文件
    /// </summary>
    /// <param name="filePath"></param>
    /// <exception cref="Exception"></exception>
    public static async Task DeleteFileAsync(string filePath)
    {
        var folder =
            Path.GetDirectoryName(filePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", ""));
        var folderPath = Path.Combine(Configuration.Configuration.AppConfig.CloudStorageUploadFolderPath, folder);
        var cloudFilePath = Path.Combine(folderPath, Path.GetFileName(filePath));

        if (!await FileExistsAsync(cloudFilePath))
        {
            return;
        }

        var response = await SendJsonRequestAsync("DeleteFile", new Dictionary<string, object>()
        {
            { "Path", cloudFilePath },
        });

        if (!response.Result)
        {
            throw new Exception(response.Message);
        }
    }
}