using System.Collections.Concurrent;
using Arsenal.Server.Model;

namespace Arsenal.Server.Services;

/// <summary>
/// 文件元数据服务
/// </summary>
public static class MetadataCacheService
{
    private static readonly ConcurrentDictionary<string,FileMetaData> FileMetaDataDic = new();

    /// <summary>
    /// 设置元数据
    /// </summary>
    /// <param name="key"></param>
    /// <param name="value"></param>
    public static void Set(string key, FileMetaData value)
    {
        FileMetaDataDic[key] = value;
    }

    /// <summary>
    /// 获取元数据
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    /// <exception cref="KeyNotFoundException"></exception>
    public static FileMetaData Get(string key)
    {
        if (FileMetaDataDic.TryGetValue(key, out var value))
        {
            return value;
        }

        throw new KeyNotFoundException();
    }
}