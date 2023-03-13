using Arsenal.Server.Model;

namespace Arsenal.Server.Configuration;

public class Configuration
{
    private static AppConfig? _appConfig;

    private static string RootFolderPath => Path.Combine(_appConfig?.LocalUploadFolderPath ?? string.Empty, "arsenal");

    public static string UploadFolderPath => Path.Combine(RootFolderPath, "files");

    public static string TempFolderPath => Path.Combine(RootFolderPath, "temp");

    public static string PartsFolderPath => Path.Combine(TempFolderPath, "parts");

    public static string DataFolderPath => Path.Combine(RootFolderPath, "data");

    /// <summary>
    /// 运行的是否是绿版
    /// </summary>
    /// <returns></returns>
    private bool IsRunAtLocal()
    {
        return GetRunAtLocalUploadFolderPath().StartsWith(@"C:\ProgramData\Forguncy");
    }

    /// <summary>
    /// 获取指定层级的父级目录
    /// </summary>
    /// <param name="folderPath"></param>
    /// <param name="num"></param>
    /// <returns></returns>
    private static DirectoryInfo GetParents(string folderPath, int num)
    {
        var directoryInfo = Directory.GetParent(folderPath);

        for (var i = 0; i < num - 1; i++)
        {
            directoryInfo = Directory.GetParent(directoryInfo!.FullName);
        }

        return directoryInfo;
    }

    /// <summary>
    /// 获取绿版的上传文件夹路径
    /// </summary>
    /// <returns></returns>
    private string GetRunAtLocalUploadFolderPath()
    {
        return Path.Combine(GetParents(GetType().Assembly.Location, 3).FullName, "Upload");
    }

    /// <summary>
    /// 获取APP名称
    /// </summary>
    /// <returns></returns>
    private static string GetAppName()
    {
        return Path.GetFileName(GetParents("", 3).FullName);
    }

    /// <summary>
    /// 创建所需目录
    /// </summary>
    private static void CreateFolders()
    {
        if (!Directory.Exists(TempFolderPath))
        {
            Directory.CreateDirectory(TempFolderPath);
        }
        
        if (!Directory.Exists(DataFolderPath))
        {
            Directory.CreateDirectory(DataFolderPath);
        }
    }

    /// <summary>
    /// 确保初始化
    /// </summary>
    public static void EnsureInit()
    {
        if (_appConfig != null)
        {
            return;
        }

        var instance = new Configuration();
        if (instance.IsRunAtLocal())
        {
            _appConfig = new AppConfig()
            {
                LocalUploadFolderPath = instance.GetRunAtLocalUploadFolderPath()
            };
        }
        else
        {
            _appConfig = GlobalConfiguration.GetAppConfig(GetAppName());
        }

        CreateFolders();
    }
}