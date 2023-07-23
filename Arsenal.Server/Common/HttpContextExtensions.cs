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
    public static void BuildResult(this HttpContext context, HttpResult result)
    {
        context.Response.ContentType = "application/json";
        context.Response.WriteAsync(JsonConvert.SerializeObject(result, Formatting.None));
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
            context.BuildResult(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }

    /// <summary>
    /// 处理异常
    /// </summary>
    /// <param name="context"></param>
    /// <param name="func"></param>
    public static void HandleError(this HttpContext context, Action func)
    {
        try
        {
            func.Invoke();
        }
        catch (Exception e)
        {
            context.BuildResult(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }
}