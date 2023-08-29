using Arsenal.Server.Common;
using Microsoft.Extensions.FileProviders;

namespace Arsenal.Server.Provider;

/// <summary>
/// 上传文件提供者
/// </summary>
public class UploadFileProvider : PhysicalFileProviderWrapper
{
    public UploadFileProvider() : base(new Lazy<PhysicalFileProvider>(() =>
        new PhysicalFileProvider(Configuration.Configuration.AppConfig.LocalUploadFolderPath)))
    {
    }

    public override IFileInfo GetFileInfo(string subpath)
    {
        var fullPath = CacheServiceProvider.UploadFilePathsCacheService.Get(subpath[1..]);

        if (fullPath != null)
        {
            return base.GetFileInfo(Path.GetRelativePath(Configuration.Configuration.AppConfig.LocalUploadFolderPath,
                fullPath));
        }

        return base.GetFileInfo(subpath);
    }
}