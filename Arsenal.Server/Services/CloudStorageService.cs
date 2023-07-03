using System.Text;
using Arsenal.Server.Common;
using Newtonsoft.Json;

namespace Arsenal.Server.Services;

/// <summary>
/// 云存储相关服务
/// 目前只支持上传, 不支持删除
/// </summary>
public sealed class CloudStorageService
{
    private const int RetryTimes = 3;

    private static bool _isInitialized;

    private static string ConvertVirgule(string value)
    {
        var strings = value.Split(new[] { '\\', '/' }, StringSplitOptions.RemoveEmptyEntries);

        return string.Join("/", strings);
    }

    private static void WriteLog(string message)
    {
        Console.WriteLine("[ARSENAL-CloudStorageAttachmentFileProcessor] " + message);
    }

    public static string GetCloudStorageFilePath(string fileName)
    {
        return ConvertVirgule(
            Path.Combine(Configuration.Configuration.AppConfig.CloudStorageUploadFolderPath, fileName));
    }

    private static string GetLocalFilePath(string fileName)
    {
        return Path.Combine(Configuration.Configuration.UploadFolderPath, fileName);
    }

    public static void EnsureInitialization()
    {
        if (_isInitialized)
        {
            return;
        }

        _isInitialized = true;

        _ = InitializeAsync();
    }

    private static Task InitializeAsync()
    {
        if (!Configuration.Configuration.AppConfig.UseCloudStorage)
        {
            return Task.CompletedTask;
        }

        var diskFiles = DataAccess.DataAccess.Instance.GetDiskFiles();

        var files = diskFiles
            .Where(i => File.Exists(Path.Combine(Configuration.Configuration.UploadFolderPath, i.Value)))
            .Select(i => i.Value)
            .ToList();

        return ConcurrentExecutionAsync(5, files,
            async i => { await RunUploadFileToCloudStorageTaskAsync(i); });
    }

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

    public static async Task CreateTaskAsync(string filePath)
    {
        await RunUploadFileToCloudStorageTaskAsync(filePath);
    }

    private static async Task<HttpResponseMessage> SendRequestAsync(
        string apiName,
        object? content = null)
    {
        var url = $"{Configuration.Configuration.AppConfig.UserServiceUrl}/CloudStorageProviderCommand/{apiName}";

        var request = new HttpRequestMessage(HttpMethod.Post, url);

        request.Headers.Add("AuthorizationName",
            Convert.ToBase64String(Encoding.UTF8.GetBytes(Configuration.Configuration.AppConfig.StorageType)));

        request.Content = new JsonContent(content);

        return await HttpClientHelper.Client.SendAsync(request);
    }

    private static async Task<ResultData> SendJsonRequestAsync(
        string apiName,
        object? content = null)
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

    public static async Task<bool> FileExistsAsync(string filePath)
    {
        // 5 是枚举中 的 Exists
        var content = new Dictionary<string, object> { { "Path", ConvertVirgule(filePath) }, { "Type", 5 } };

        var result = await SendJsonRequestAsync("GetFileInformation", content);

        return (bool)result.Properties["Value"];
    }

    private static async Task<ResultData> UploadFileToCloudStorageAsync(string filePath)
    {
        var folder = Path.GetDirectoryName(filePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", ""));

        return await SendJsonRequestAsync("UploadFile", new Dictionary<string, object>
        {
            { "LocalFilePath", filePath },
            { "FolderPath", Path.Combine(Configuration.Configuration.AppConfig.CloudStorageUploadFolderPath, folder) }
        });
    }

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
}