using System.Collections.Concurrent;
using Arsenal.Server.Model;

namespace Arsenal.Server.Common;

public static class MetadataManagement
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