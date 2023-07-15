using System.Diagnostics;
using Arsenal.Server.Model.HttpResult;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.ServerApi;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Arsenal.Server.Controllers;

public class Console : ForguncyApi
{
    [Post]
    public async Task ListItems()
    {
        await SecurityExecutionFuncAsync(async () =>
        {
            var body = await ParseBodyAsync<ListItemsParam>();

            var result = FileUploadService.ListItems(body.RelativePath?.TrimStart('/') ?? string.Empty);

            BuildHttpResult(new HttpSuccessResult(result));
        });
    }

    private void SecurityExecutionAction(Action action)
    {
        try
        {
            action.Invoke();
        }
        catch (Exception e)
        {
            BuildHttpResult(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }

    private async Task SecurityExecutionFuncAsync(Func<Task> func)
    {
        try
        {
            await func.Invoke();
        }
        catch (Exception e)
        {
            BuildHttpResult(new HttpFailureResult(e.Message));
            Trace.WriteLine(e);
        }
    }

    private async Task<T> ParseBodyAsync<T>() where T : new()
    {
        var reader = new StreamReader(Context.Request.Body);

        var body = await reader.ReadToEndAsync();

        var data = JsonConvert.DeserializeObject<T>(body);

        return data ?? new T();
    }

    private void BuildHttpResult(HttpResult result)
    {
        Context.Response.ContentType = "application/json";
        Context.Response.WriteAsync(JsonConvert.SerializeObject(result, Formatting.None));
    }
}