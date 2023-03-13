﻿using Arsenal.Server.Model;

namespace Arsenal.Server.Configuration;

public class Configuration
{
    private static AppConfig? _appConfig;

    private static string RootFolderPath => Path.Combine(_appConfig?.LocalUploadFolderPath ?? string.Empty, "arsenal");

    public static string UploadFolderPath => Path.Combine(RootFolderPath, "files");

    public static string TempFolderPath => Path.Combine(RootFolderPath, "temp");

    public static string DataFolderPath => Path.Combine(RootFolderPath, "data");
    
    public static readonly Lazy<Configuration> Instance = new(() => new Configuration());

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
    public void EnsureInit()
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
        CopyDesignerFilesToWebSite();
    }
}