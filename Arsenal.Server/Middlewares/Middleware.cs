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
        Configuration.Configuration.EnsureInit();

        if (context.Request.Path.Value.StartsWith("/Upload/"))
        {
            var filepath = context.Request.Path.Value?.Replace("/Upload/", "");

            var virtualFile = DataAccess.GetVirtualFile(filepath);

            if (virtualFile != null)
            {
                var diskFile = DataAccess.GetDiskFile(virtualFile);

                if (diskFile != null)
                {
                    var filePath = Path.Combine(Configuration.Configuration.UploadFolderPath, diskFile);
                    using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                    await stream.CopyToAsync(context.Response.Body);

                    return;
                }
            }
        }

        await _next(context);
    }
}