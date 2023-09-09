using System.Text;
using Arsenal.Server.Common;
using Arsenal.Server.Provider;
using Arsenal.Server.Services;

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
        if (context.Request.Path.Value!.Contains("/customapi/arsenal/"))
        {
            BootstrapService.EnsureInitialization(context);
        }

        if (context.Request.Path.Value.Contains("/converted-file"))
        {
            BootstrapService.EnsureInitialization(context);

            if (context.Request.Method == "HEAD")
            {
                var args = FileConvertService.GetConvertFileArgsFromContext(context);
                var exists = FileConvertService.ConvertedFileExists(args.Url, args.TargetFileType);
                context.Response.StatusCode = exists ? 200 : 404;
                return;
            }

            await context.HandleErrorAsync(async () =>
            {
                var filePath = await FileConvertService.GetConvertedFileAsync(context);
                var cacheKey = context.Request.Path.Value.Split("/").Last();
                CacheServiceProvider.ConvertedFilePathsService.Set(cacheKey, filePath);
                await _next(context);
            });

            return;
        }

        if (context.Request.Path.Value.Contains("/Upload/"))
        {
            BootstrapService.EnsureInitialization(context);

            var fileKey = context.Request.Path.Value.Split("/", StringSplitOptions.RemoveEmptyEntries).Last();

            if (!FileUploadService.IsValidFileKey(fileKey))
            {
                await _next(context);
                return;
            }

            var diskFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            if (diskFilePath != null && !File.Exists(diskFilePath) &&
                Configuration.Configuration.AppConfig.UseCloudStorage)
            {
                var relativePath =
                    diskFilePath
                        .Replace(Configuration.Configuration.UploadFolderPath + Path.DirectorySeparatorChar, "")
                        .Replace("\\", "/");

                context.Response.Redirect(Uri.EscapeUriString(relativePath));
                return;
            }

            CacheServiceProvider.UploadFilePathsCacheService.Set(fileKey, diskFilePath);
        }
        else if (context.Request.Path.Value.Contains("/FileDownloadUpload/Download"))
        {
            BootstrapService.EnsureInitialization(context);

            var fileKey = context.Request.Query["file"];

            if (!FileUploadService.IsValidFileKey(fileKey))
            {
                await _next(context);
                return;
            }

            var diskFilePath = await FileUploadService.GetFileFullPathByFileKeyAsync(fileKey);

            if (context.Request.Method == "HEAD")
            {
                if (File.Exists(diskFilePath) || Configuration.Configuration.AppConfig.UseCloudStorage)
                {
                    context.Response.StatusCode = 200;
                    return;
                }
            }

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
                    var relativePath =
                        Uri.EscapeUriString(diskFilePath
                            .Replace(Configuration.Configuration.UploadFolderPath + Path.DirectorySeparatorChar, "")
                            .Replace("\\", "/"));

                    if (Configuration.Configuration.AppConfig.UsePublicUrl)
                    {
                        context.Response.Redirect("Download?file=" + relativePath);
                        return;
                    }

                    var request = new HttpRequestMessage(HttpMethod.Get,
                        $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}{context.Request.Path}?file=" +
                        relativePath);

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