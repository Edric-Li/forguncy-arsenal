using System.Collections.Concurrent;
using Arsenal.Server.Model;

namespace Arsenal.Server.Services;

/// <summary>
/// 元数据管理
/// </summary>
public static class MetadataCacheService
{
    private static readonly ConcurrentDictionary<string,FileMetaData> FileMetaDataDic = new();

    public static void Set(string key, FileMetaData value)
    {
        FileMetaDataDic[key] = value;
    }

    public static FileMetaData Get(string key)
    {
        if (FileMetaDataDic.TryGetValue(key, out var value))
        {
            return value;
        }

        throw new KeyNotFoundException();
    }
}