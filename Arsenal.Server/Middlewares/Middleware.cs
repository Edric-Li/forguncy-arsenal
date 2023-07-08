using Arsenal.Server.Common;
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

    public async Task InvokeAsync(HttpContext context)
    {
        BootstrapServices.EnsureInitialization();

        if (context.Request.Path.Value.StartsWith("/Upload/"))
        {
            var filepath = context.Request.Path.Value?.Replace("/Upload/", "");
            var diskFilePath = FileUploadService.GetDiskFilePathByFileId(filepath);

            if (diskFilePath != null)
            {
                var stream = FileUploadService.GetDiskFileStreamBySoftLink(diskFilePath);

                if (stream != null)
                {
                    await stream.CopyToAsync(context.Response.Body);
                    await stream.DisposeAsync();
                    return;
                }

                if (Configuration.Configuration.AppConfig.UseCloudStorage)
                {
                    context.Response.Redirect(diskFilePath.Replace("\\", "/"));
                    return;
                }
            }
        }
        else if (context.Request.Path.Value.StartsWith("/FileDownloadUpload/Download"))
        {
            var fileId = context.Request.Query["file"];
            var diskFilePath = FileUploadService.GetDiskFilePathByFileId(fileId);

            if (diskFilePath != null)
            {
                var stream = FileUploadService.GetDiskFileStreamBySoftLink(diskFilePath);

                if (stream != null)
                {
                    context.Response.Headers.Add("Content-Type", "application/octet-stream");
                    context.Response.Headers.Add("content-disposition",
                        "attachment;filename=" + fileId.ToString()[37..]);

                    await stream.CopyToAsync(context.Response.Body);
                    await stream.DisposeAsync();
                    return;
                }

                if (Configuration.Configuration.AppConfig.UseCloudStorage)
                {
                    if (Configuration.Configuration.AppConfig.UsePublicUrl)
                    {
                        context.Response.Redirect("Download?file=" + diskFilePath.Replace("\\", "/"));
                        return;
                    }

                    var request = new HttpRequestMessage(HttpMethod.Get,
                        $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}{context.Request.Path}?file=" +
                        diskFilePath.Replace("\\", "/"));

                    var response = await HttpClientHelper.Client.SendAsync(request);

                    var fileName = Path.GetFileName(diskFilePath);
                    context.Response.Headers.Add("Content-Type", "application/octet-stream");
                    context.Response.Headers.Add("content-disposition", "attachment;filename=" + fileName);
                    await response.Content.CopyToAsync(context.Response.Body);
                    return;
                }
            }
        }

        await _next(context);
    }
}