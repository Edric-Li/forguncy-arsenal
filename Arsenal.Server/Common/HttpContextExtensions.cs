using System.Diagnostics;
using Arsenal.Server.Model.HttpResult;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Arsenal.Server.Common;

/// <summary>
/// HttpContext 扩展
/// </summary>
public static class HttpContextExtensions
{
    /// <summary>
    /// 构建 HttpResult
    /// </summary>
    /// <param name="context"></param>
    /// <param name="result"></param>
    public static async Task BuildResultAsync(this HttpContext context, HttpResult result)
    {
        context.Response.ContentType = "application/json";

        if (context.Response.Body.CanWrite)
        {
            await context.Response.WriteAsync(JsonConvert.SerializeObject(result, Formatting.None));
        }
    }

    /// <summary>
    /// 解析请求体
    /// </summary>
    /// <param name="context"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public static async Task<T> ParseBodyAsync<T>(this HttpContext context) where T : new()
    {
        var reader = new StreamReader(context.Request.Body);

        var body = await reader.ReadToEndAsync();

        var data = JsonConvert.DeserializeObject<T>(body);

        return data ?? new T();
    }

    /// <summary>
    /// 处理异常
    /// </summary>
    /// <param name="context"></param>
    /// <param name="func"></param>
    public static async Task HandleErrorAsync(this HttpContext context, Func<Task> func)
    {
        try
        {
            await func.Invoke();
        }
        catch (Exception e)
        {
            await context.BuildResultAsync(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }

    /// <summary>
    /// 写入流
    /// </summary>
    /// <param name="context"></param>
    /// <param name="stream"></param>
    private static async Task ResponseStreamAsync(this HttpContext context, Stream stream)
    {
        await stream.CopyToAsync(context.Response.Body);
        _ = stream.DisposeAsync();
    }

    /// <summary>
    /// 通过文件路径写入流
    /// </summary>
    /// <param name="context"></param>
    /// <param name="filePath"></param>
    public static async Task ResponseStreamByFilePathAsync(this HttpContext context, string filePath)
    {
        await context.ResponseStreamAsync(GetStreamByFilePath(filePath));
    }

    /// <summary>
    /// 通过文件路径获取流
    /// </summary>
    /// <param name="filePath"></param>
    /// <returns></returns>
    private static Stream GetStreamByFilePath(string filePath)
    {
        return new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 4096, true);
    }
}