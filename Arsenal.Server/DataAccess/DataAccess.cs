using Arsenal.Server.Services;
using LevelDB;

namespace Arsenal.Server.DataAccess;

/// <summary>
/// 数据访问层
/// </summary>
public class DataAccess
{
    /// <summary>
    /// 磁盘文件数据库
    /// </summary>
    private readonly DB _diskFilesDb;

    /// <summary>
    /// 软链接数据库
    /// </summary>
    private readonly DB _softLinksFilesDb;

    /// <summary>
    /// 懒加载实例
    /// </summary>
    private static readonly Lazy<DataAccess> LazyInstance = new(() => new DataAccess());

    /// <summary>
    /// 数据层访问实例
    /// </summary>
    public static DataAccess Instance => LazyInstance.Value;

    /// <summary>
    /// 时间戳, RunAtLocal时使用
    /// </summary>
    private readonly string _unixTimestampStr;

    private bool _isInitialized;

    private DataAccess()
    {
        if (Configuration.Configuration.RunAtLocal)
        {
            var directories = Directory.GetDirectories(Configuration.Configuration.DataFolderPath);

            if (directories.Length > 0)
            {
                long maxLongValue = 0;

                foreach (var item in directories)
                {
                    if (long.TryParse(Path.GetFileName(item), out var longValue))
                    {
                        if (longValue > maxLongValue)
                        {
                            maxLongValue = longValue;
                        }
                    }
                }

                if (maxLongValue != 0)
                {
                    _unixTimestampStr = maxLongValue.ToString();
                }
            }

            _unixTimestampStr ??= DateTimeOffset.Now.ToUnixTimeMilliseconds().ToString();
        }

        var options = new Options { CreateIfMissing = true, };

        _diskFilesDb = new DB(options, GetDbPath("diskfiles.db"));
        _softLinksFilesDb = new DB(options, GetDbPath("softLinks.db"));
    }

    private string GetDbPath(string dbName)
    {
        return Configuration.Configuration.RunAtLocal
            ? Path.Combine(Configuration.Configuration.DataFolderPath, _unixTimestampStr, dbName)
            : Path.Combine(Configuration.Configuration.DataFolderPath, dbName);
    }

    public void EnsureInitialization()
    {
        if (_isInitialized)
        {
            return;
        }

        _isInitialized = true;
        _ = MergeDatabaseAsync();
    }

    private static async Task MergeDatabaseAsync()
    {
        var directories = Directory.GetDirectories(Configuration.Configuration.DataFolderPath);

        if (directories.Length < 1)
        {
            return;
        }

        foreach (var item in directories)
        {
            if (!long.TryParse(Path.GetFileName(item), out _))
            {
                continue;
            }

            var diskFilesDb = new DB(new Options { CreateIfMissing = true, }, Path.Combine(item, "diskfiles.db"));
            var softLinksFilesDb = new DB(new Options { CreateIfMissing = true, }, Path.Combine(item, "softLinks.db"));

            foreach (var keyValuePair in GetKeyValuesByDb(diskFilesDb))
            {
                if (await FileUploadService.ExistsFileInUploadFolderAsync(keyValuePair.Key))
                {
                    continue;
                }

                Instance.PutDiskFile(keyValuePair.Key, keyValuePair.Value);
            }

            foreach (var softLinksFile in GetKeyValuesByDb(softLinksFilesDb))
            {
                Instance.PutVirtualFile(softLinksFile.Key, softLinksFile.Value);
            }

            diskFilesDb.Dispose();
            softLinksFilesDb.Dispose();

            Directory.Delete(item, true);
        }
    }

    private static Dictionary<string, string> GetKeyValuesByDb(DB db)
    {
        var dic = new Dictionary<string, string>();

        foreach (var (key, value) in db)
        {
            dic.Add(System.Text.Encoding.UTF8.GetString(key), System.Text.Encoding.UTF8.GetString(value));
        }

        return dic;
    }

    public void PutDiskFile(string key, string value)
    {
        _diskFilesDb.Put(key, value);
    }

    public string? GetDiskFile(string key)
    {
        return _diskFilesDb.Get(key);
    }

    public void DeleteDiskFile(string key)
    {
        _diskFilesDb.Delete(key);
    }

    public void PutVirtualFile(string key, string value)
    {
        _softLinksFilesDb.Put(key, value);
    }

    public string? GetVirtualFile(string key)
    {
        return _softLinksFilesDb.Get(key);
    }

    public Dictionary<string, string> GetDiskFiles()
    {
        return GetKeyValuesByDb(_diskFilesDb);
    }

    public Dictionary<string, string> GetSoftLinksFiles()
    {
        return GetKeyValuesByDb(_softLinksFilesDb);
    }
}