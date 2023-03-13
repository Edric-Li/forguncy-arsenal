using Arsenal.Server.Services;
using Microsoft.AspNetCore.Http;

namespace Arsenal.Server.Middlewares;

internal class Middleware
{
    private readonly RequestDelegate _next;

    public Middleware(RequestDelegate next)
    {
        _next = next;
    }

    private static DataAccess.DataAccess DataAccess => Server.DataAccess.DataAccess.Instance;

    public async Task InvokeAsync(HttpContext context)
    {
        Configuration.Configuration.Instance.Value.EnsureInit();

        if (context.Request.Path.Value.StartsWith("/Upload/"))
        {
            var filepath = context.Request.Path.Value?.Replace("/Upload/", "");

            var stream = FileUploadService.GetDiskFileStreamBySoftLink(filepath);

            if (stream != null)
            {
                await stream.CopyToAsync(context.Response.Body);
                await stream.DisposeAsync();
                return;
            }
        }
        else if (context.Request.Path.Value.StartsWith("/FileDownloadUpload/Download"))
        {
            var fileId = context.Request.Query["file"];

            var stream = FileUploadService.GetDiskFileStreamBySoftLink(fileId);

            if (stream != null)
            {
                context.Response.Headers.Add("Content-Type", "application/octet-stream");
                context.Response.Headers.Add("content-disposition", "attachment;filename=" + fileId.ToString()[37..]);

                await stream.CopyToAsync(context.Response.Body);
                await stream.DisposeAsync();
                return;
            }
        }

        await _next(context);
    }
}