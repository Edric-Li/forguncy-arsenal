using Arsenal.Server.Model;
using GrapeCity.Forguncy.ServerApi;

namespace Arsenal.Server.Services;

/// <summary>
/// 文件元数据服务
/// </summary>
public static class MetadataCacheService
{
    public static ICacheService CacheService { get; set; }
    
    /// <summary>
    /// 设置元数据
    /// </summary>
    /// <param name="key"></param>
    /// <param name="value"></param>
    public static void Set(string key, FileMetaData value)
    {
        CacheService.Replace(key, value, TimeSpan.FromMinutes(30));
    }

    /// <summary>
    /// 获取元数据
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    /// <exception cref="KeyNotFoundException"></exception>
    public static FileMetaData Get(string key)
    {
        var value = CacheService.Get<FileMetaData>(key);
        if (value != null)
        {
            return value;
        }

        throw new KeyNotFoundException();
    }
}