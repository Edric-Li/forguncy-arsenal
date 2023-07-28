using System.Text;
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

    private static bool IsValidFileKey(string input)
    {
        if (input.Length > 37 && input[36] != '_')
        {
            return false;
        }

        if (!Guid.TryParse(input[..36], out _))
        {
            return false;
        }

        return !string.IsNullOrEmpty(input[37..]);
    }

    public async Task InvokeAsync(HttpContext context)
    {
        BootstrapService.EnsureInitialization();

        if (context.Request.Path.Value.Contains("/Upload/"))
        {
            var fileKey = context.Request.Path.Value.Split("/", StringSplitOptions.RemoveEmptyEntries).Last();

            if (!IsValidFileKey(fileKey))
            {
                await _next(context);
                return;
            }

            var diskFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            if (context.Request.Query["ac"] == "1")
            {
                if (new FileConvertService(fileKey, diskFilePath).TryConvertFileAsync(out var newFilePath))
                {
                    diskFilePath = newFilePath;
                }
            }

            if (diskFilePath != null)
            {
                var stream = FileUploadService.GetFileStreamByFilePath(diskFilePath);

                if (stream != null)
                {
                    await stream.CopyToAsync(context.Response.Body);
                    await stream.DisposeAsync();
                    return;
                }

                if (Configuration.Configuration.AppConfig.UseCloudStorage)
                {
                    var relativePath = diskFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", "");
                    context.Response.Redirect(relativePath.Replace("\\", "/"));
                    return;
                }
            }
        }
        else if (context.Request.Path.Value.Contains("/FileDownloadUpload/Download"))
        {
            var fileKey = context.Request.Query["file"];

            if (!IsValidFileKey(fileKey))
            {
                await _next(context);
                return;
            }

            var diskFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            if (diskFilePath != null)
            {
                var stream = FileUploadService.GetFileStreamByFilePath(diskFilePath);

                if (stream != null)
                {
                    var fileName = fileKey.ToString()[37..];

                    var bytes = Encoding.UTF8.GetBytes(fileName);
                    var encodedFileName = Uri.EscapeDataString(Encoding.UTF8.GetString(bytes));

                    context.Response.Headers.Add("Content-Type", "application/octet-stream");
                    context.Response.Headers.Add("content-disposition",
                        $"attachment;filename*=UTF-8''{encodedFileName}");

                    await stream.CopyToAsync(context.Response.Body);
                    await stream.DisposeAsync();
                    return;
                }

                if (Configuration.Configuration.AppConfig.UseCloudStorage)
                {
                    var relativePath = diskFilePath.Replace(Configuration.Configuration.UploadFolderPath + "\\", "");

                    if (Configuration.Configuration.AppConfig.UsePublicUrl)
                    {
                        context.Response.Redirect("Download?file=" + relativePath.Replace("\\", "/"));
                        return;
                    }

                    var request = new HttpRequestMessage(HttpMethod.Get,
                        $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}{context.Request.Path}?file=" +
                        relativePath.Replace("\\", "/"));

                    var response = await HttpClientHelper.Client.SendAsync(request);

                    var fileName = Path.GetFileName(relativePath);
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