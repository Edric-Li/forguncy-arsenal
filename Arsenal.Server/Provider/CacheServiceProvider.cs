using Arsenal.Server.Model;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.ServerApi;

namespace Arsenal.Server.Provider;

/// <summary>
/// 缓存提供者
/// </summary>
public abstract class CacheServiceProvider
{
    /// <summary>
    /// 上传文件路径缓存服务
    /// </summary>
    public static readonly CacheService<string> UploadFilePathsCacheService = new("UploadFolderPaths");

    /// <summary>
    /// 转换后的文件路径缓存服务
    /// </summary>
    public static readonly CacheService<string> ConvertedFilePathsService = new("ConvertedFilePaths");

    /// <summary>
    /// 上传文件元数据缓存服务
    /// </summary>
    public static readonly CacheService<FileMetaData> UploadMetadataCacheService = new("Metadata");

    /// <summary>
    /// 缓存服务提供者
    /// </summary>
    public static ICacheService ServiceProvider { get; private set; }

    /// <summary>
    /// 确保初始化
    /// </summary>
    /// <param name="context"></param>
    public static void EnsureInitialization(HttpContext context)
    {
        ServiceProvider ??= context.RequestServices.GetService(typeof(ICacheService)) as ICacheService;
    }
}