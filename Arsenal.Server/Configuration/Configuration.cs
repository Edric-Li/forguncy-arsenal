﻿using System.Diagnostics;
using System.Text;
using Arsenal.Server.DataBase;
using Arsenal.Server.Model;

namespace Arsenal.Server.Configuration;

/// <summary>
/// 配置类
/// </summary>
public class Configuration
{
    /// <summary>
    /// 该插件在存储目录下的文件夹路径
    /// </summary>
    public static string RootFolderPath => Path.Combine(AppConfig?.LocalUploadFolderPath ?? string.Empty, "arsenal");

    /// <summary>
    /// 上传文件夹路径
    /// </summary>
    public static string UploadFolderPath => Path.Combine(RootFolderPath, "files");

    /// <summary>
    /// 临时下载文件夹路径
    /// </summary>
    public static string TemporaryDownloadFolderPath => Path.Combine(RootFolderPath, "temporary_download_files");

    /// <summary>
    /// 转换后的文件夹路径
    /// </summary>
    public static string ConvertedFolderPath { get; private set; }

    /// <summary>
    /// 临时文件夹路径
    /// </summary>
    public static string TempFolderPath { get; private set; }

    /// <summary>
    /// 数据文件夹路径
    /// </summary>
    public static string DataFolderPath => Path.Combine(RootFolderPath, "data");

    /// <summary>
    /// 当前插件根目录
    /// </summary>
    public static string CurrentPluginRootPath => Instance.GetCurrentPluginRoot();

    /// <summary>
    /// 数据库链接串
    /// </summary>
    public static string DatabaseConnectionString { get; set; } = string.Empty;

    /// <summary>
    /// 应用相关配置
    /// </summary>
    public static AppConfig AppConfig { get; private set; }

    /// <summary>
    /// 懒加载实例
    /// </summary>
    public static Configuration Instance => LazyInstance.Value;

    /// <summary>
    /// 是否运行在本地
    /// </summary>
    public static bool RunAtLocal { get; private set; }

    /// <summary>
    /// 默认的用户服务地址
    /// </summary>
    public const string DefaultUserServiceUrl = "http://127.0.0.1:22345/UserService";

    /// <summary>
    /// 临时链接的前缀
    /// </summary>
    public const string TemporaryLinkPrefix = "aaa";

    /// <summary>
    /// 懒加载实例
    /// </summary>
    private static readonly Lazy<Configuration> LazyInstance = new(() => new Configuration());

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
    /// 获取当前插件根目录
    /// </summary>
    /// <returns></returns>
    private string GetCurrentPluginRoot()
    {
        return GetParents(GetType().Assembly.Location, 1).FullName;
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

        if (!Directory.Exists(ConvertedFolderPath))
        {
            Directory.CreateDirectory(ConvertedFolderPath);
        }
    }

    private string GetArsenalTempPath()
    {
        var workFolder = GetParents(GetType().Assembly.Location, 4).FullName;

        return Path.Combine(workFolder, "ArsenalTemp");
    }

    /// <summary>
    /// 初始化数据库相关信息
    /// </summary>
    private void InitDesignerDatabaseFile()
    {
        var arsenalTemp = GetArsenalTempPath();

        if (!Directory.Exists(arsenalTemp))
        {
            Directory.CreateDirectory(arsenalTemp);
        }

        var databaseFilePath = DatabaseInitializer.GetDatabaseFilePath();

        var destDatabaseFilePath = Path.Combine(arsenalTemp, Path.GetFileName(databaseFilePath));

        if (File.Exists(databaseFilePath))
        {
            File.Copy(databaseFilePath, destDatabaseFilePath, true);
        }

        DatabaseInitializer.DatabaseFilePath = destDatabaseFilePath;

        File.WriteAllText(Path.Combine(arsenalTemp, "db_file_path"), destDatabaseFilePath, Encoding.UTF8);
    }

    /// <summary>
    /// 加载设计器文件到网站
    /// 这个操作有点2,不过确实想不到啥好的方案了，等后续看官方有没有出接口吧
    /// 能把功能实现就可以了
    /// </summary>
    private void CopyDesignerFilesToWebSite()
    {
        var workFolder = GetParents(GetType().Assembly.Location, 4).FullName;

        var designerArsenalFolder = Path.Combine(workFolder, "Designer", "arsenal");

        if (!Directory.Exists(designerArsenalFolder))
        {
            return;
        }

        var designerFiles = Directory.GetFiles(designerArsenalFolder, "*", SearchOption.AllDirectories);

        Parallel.ForEach(designerFiles, designerFile =>
        {
            var webSiteFile = designerFile.Replace(designerArsenalFolder, string.Empty);

            try
            {
                File.Copy(designerFile, Path.Combine(RootFolderPath, webSiteFile), true);
            }
            catch (Exception e)
            {
                Trace.Write(e.Message);
            }
        });
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
        }
        else
        {
            AppConfig = GlobalConfigParser.GetAppConfig(GetAppName());
        }

        var path = instance.IsRunAtLocal() ? GetArsenalTempPath() : RootFolderPath;

        ConvertedFolderPath = Path.Combine(path, "converted_files");
        TempFolderPath = Path.Combine(path, "temp");

        CreateFolders();

        if (instance.IsRunAtLocal())
        {
            CopyDesignerFilesToWebSite();
            InitDesignerDatabaseFile();
        }
    }
}