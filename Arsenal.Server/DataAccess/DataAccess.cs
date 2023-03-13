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

    private readonly DB _softLinksFilesDb;

    private static DataAccess? _instance;

    public static DataAccess Instance => _instance ??= new DataAccess();

    private DataAccess()
    {
        var options = new Options { CreateIfMissing = true, };

        _diskFilesDb = new DB(options, Path.Combine(Configuration.Configuration.DataFolderPath, "diskfiles.db"));
        _softLinksFilesDb = new DB(options, Path.Combine(Configuration.Configuration.DataFolderPath, "softLinks.db"));
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

    public string GetVirtualFile(string key)
    {
        return _softLinksFilesDb.Get(key);
    }

    public void DeleteVirtualFile(string key)
    {
        _softLinksFilesDb.Delete(key);
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