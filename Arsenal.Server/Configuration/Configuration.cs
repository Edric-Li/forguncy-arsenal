using Arsenal.Server.Model;

namespace Arsenal.Server.Configuration;

public class Configuration
{
    private static string RootFolderPath => Path.Combine(AppConfig?.LocalUploadFolderPath ?? string.Empty, "arsenal");

    private static readonly Lazy<Configuration> LazyInstance = new(() => new Configuration());

    public static string UploadFolderPath => Path.Combine(RootFolderPath, "files");

    public static string TempFolderPath => Path.Combine(RootFolderPath, "temp");

    public static string DataFolderPath => Path.Combine(RootFolderPath, "data");

    public static readonly Configuration Instance = LazyInstance.Value;

    public static AppConfig? AppConfig { get; private set; }

    /// <summary>
    /// 是否运行在本地
    /// </summary>
    public static bool RunAtLocal { get; private set; }

    public const string DefaultUserServiceUrl = "http://127.0.0.1:22345/UserService";

    /// <summary>
    /// 运行的是否是绿版
    /// </summary>
    /// <returns></returns>
    private bool IsRunAtLocal()
    {
        var programdataFolder = Environment.ExpandEnvironmentVariables("%programdata%");
        return GetRunAtLocalUploadFolderPath().StartsWith(Path.Combine(programdataFolder, "Forguncy"));
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
    private string GetAppName()
    {
        return Path.GetFileName(GetParents(GetType().Assembly.Location, 3).FullName);
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
    /// 加载设计器文件到网站
    /// 这个操作有点2,不过确实想不到啥好的方案了，等后续看官方有没有出接口吧
    /// 能把功能实现就可以了
    /// </summary>
    private void CopyDesignerFilesToWebSite()
    {
        var workFolder = GetParents(GetType().Assembly.Location, 4).FullName;

        var designerFolder = Path.Combine(workFolder, "Designer", "arsenal");

        if (!Directory.Exists(designerFolder))
        {
            return;
        }
        
        var designerFiles = Directory.GetFiles(designerFolder, "*", SearchOption.AllDirectories);
        
        foreach (var designerFile in designerFiles)
        {
            var webSiteFile = designerFile.Replace(designerFolder, string.Empty);

            File.Copy(designerFile, Path.Combine(RootFolderPath, webSiteFile), true);
        }
    }

    /// <summary>
    /// 确保初始化
    /// </summary>
    public void EnsureInitialization()
    {
        if (AppConfig != null)
        {
            return;
        }

        var instance = new Configuration();
        if (instance.IsRunAtLocal())
        {
            RunAtLocal = true;
            AppConfig = new AppConfig()
            {
                LocalUploadFolderPath = instance.GetRunAtLocalUploadFolderPath(),
                UserServiceUrl = DefaultUserServiceUrl
            };

            CopyDesignerFilesToWebSite();
        }
        else
        {
            AppConfig = GlobalConfiguration.GetAppConfig(GetAppName());
        }

        CreateFolders();
    }
}