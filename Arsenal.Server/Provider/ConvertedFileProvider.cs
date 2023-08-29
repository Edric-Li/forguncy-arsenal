using Arsenal.Server.Common;
using Microsoft.Extensions.FileProviders;

namespace Arsenal.Server.Provider;

/// <summary>
/// 转换文件提供者
/// </summary>
public class ConvertedFileProvider : PhysicalFileProviderWrapper
{
    public ConvertedFileProvider() : base(new Lazy<PhysicalFileProvider>(() =>
        new PhysicalFileProvider(Configuration.Configuration.ConvertedFolderPath)))
    {
    }

    public override IFileInfo GetFileInfo(string subpath)
    {
        var fullPath = CacheServiceProvider.ConvertedFilePathsService.Get(subpath[1..]);

        return base.GetFileInfo(fullPath != null
            ? Path.GetRelativePath(Configuration.Configuration.ConvertedFolderPath, fullPath)
            : subpath);
    }
}