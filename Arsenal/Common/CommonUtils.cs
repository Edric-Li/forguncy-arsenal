using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using GrapeCity.Forguncy.Plugin;
using Microsoft.Data.Sqlite;

namespace Arsenal.Common;

public abstract class CommonUtils
{
    /// <summary>
    /// 当前工程的工作目录
    /// </summary>
    private static string WorkingDirectory { get; set; } = string.Empty;

    /// <summary>
    /// 根目录
    /// </summary>
    private static string RootFolderPath => Path.Combine(WorkingDirectory, "WebSite", "Upload", "arsenal");

    /// <summary>
    /// 最后一次备份数据库文件的时间
    /// </summary>
    private static DateTime? _lastBackupDatabaseFileTime;

    /// <summary>
    /// 是否正在复制网站文件到设计器
    /// </summary>
    private static bool _isCopyingWebSiteFilesToDesigner;

    /// <summary>
    /// 复制网站文件到设计器锁
    /// </summary>
    private static readonly object CopyWebSiteFilesToDesignerLock = new();

    /// <summary>
    /// 最后一次复制网站文件到设计器的时间
    /// </summary>
    private static DateTime _lastCopyWebSiteFilesToDesignerTime = DateTime.MinValue;

    /// <summary>
    /// 水印编辑器的index.html文件路径
    /// </summary>
    private static string _watermarkEditorIndexHtmlPath;

    /// <summary>
    /// 获取数据库文件路径
    /// </summary>
    /// <returns></returns>
    private static string GetDatabaseFilePath()
    {
        var dbFilePath = Path.Combine(WorkingDirectory, "ArsenalTemp", "db_file_path");

        return !File.Exists(dbFilePath) ? null : File.ReadAllText(dbFilePath);
    }

    /// <summary>
    /// 根据IFileUploadContext初始化工作目录
    /// </summary>
    /// <param name="context"></param>
    public static void InitWorkingDirectoryByIFileUploadContext(IFileUploadContext context)
    {
        WorkingDirectory =
            GetFolderSpecifyParent(context.GetForguncyUserTemplateFolderLocalPath(), 4).FullName;
    }

    /// <summary>
    /// 备份数据库文件
    /// </summary>
    public static void BackupDatabaseFile()
    {
        // 如果没有工作目录，不备份
        if (WorkingDirectory == string.Empty)
        {
            return;
        }

        // 3秒内不重复备份
        if (_lastBackupDatabaseFileTime != null && DateTime.Now - _lastBackupDatabaseFileTime < TimeSpan.FromSeconds(3))
        {
            return;
        }

        var dbFilePath = GetDatabaseFilePath();

        // 数据库文件不存在，不备份
        if (dbFilePath == null)
        {
            return;
        }

        var destFilePath = Path.Combine(RootFolderPath, "data", Path.GetFileName(dbFilePath));

        // 如果数据库文件没有变化，不备份
        if (File.Exists(destFilePath) &&
            new FileInfo(dbFilePath).LastWriteTime <= new FileInfo(destFilePath).LastWriteTime)
        {
            // 如果数据库文件没有变化，不备份
            return;
        }

        var sqliteConnection = new SqliteConnection("Data Source=" + dbFilePath);
        var destSqliteConnection = new SqliteConnection($"Data Source={destFilePath};pooling=false");

        var destFolder = Path.GetDirectoryName(destFilePath);

        if (!Directory.Exists(destFolder))
        {
            return;
        }

        sqliteConnection.Open();
        destSqliteConnection.Open();
        sqliteConnection.BackupDatabase(destSqliteConnection);
        sqliteConnection.Dispose();
        destSqliteConnection.Dispose();

        _lastBackupDatabaseFileTime = DateTime.Now;

        CopyWebSiteFilesToDesigner();
    }

    /// <summary>
    /// 获取指定层级的父级目录
    /// </summary>
    /// <param name="folderPath"></param>
    /// <param name="num"></param>
    /// <returns></returns>
    private static DirectoryInfo GetFolderSpecifyParent(string folderPath, int num)
    {
        var directoryInfo = Directory.GetParent(folderPath);

        for (var i = 0; i < num - 1; i++)
        {
            directoryInfo = Directory.GetParent(directoryInfo!.FullName);
        }

        return directoryInfo;
    }

    /// <summary>
    /// 复制网站文件到设计器
    /// </summary>
    public static void CopyWebSiteFilesToDesigner()
    {
        // 如果工作目录为空，则直接返回
        if (string.IsNullOrWhiteSpace(WorkingDirectory))
        {
            return;
        }

        // 如果正在复制网站文件到设计器，则直接返回
        if (_isCopyingWebSiteFilesToDesigner)
        {
            return;
        }

        // 3秒内不重复复制
        if (DateTime.Now - _lastCopyWebSiteFilesToDesignerTime < TimeSpan.FromSeconds(3))
        {
            return;
        }

        lock (CopyWebSiteFilesToDesignerLock)
        {
            try
            {
                _isCopyingWebSiteFilesToDesigner = true;

                var designerUploadFolderPath = Path.Combine(WorkingDirectory, "Designer", "Upload");
                var webSiteUploadFolder = Path.Combine(WorkingDirectory, "WebSite", "Upload");
                var webSiteUploadArsenalFolder = Path.Combine(webSiteUploadFolder, "arsenal");

                if (Directory.Exists(webSiteUploadArsenalFolder))
                {
                    var allUsedUploadFilePaths = Directory
                        .GetFiles(webSiteUploadArsenalFolder, "*.*", SearchOption.AllDirectories)
                        .ToList();

                    Parallel.ForEach(allUsedUploadFilePaths, iFilePath =>
                    {
                        if (iFilePath.Contains("sqlite3-shm") || iFilePath.Contains("sqlite3-wal"))
                        {
                            return;
                        }

                        var targetFilePath = Path.Combine(designerUploadFolderPath,
                            iFilePath.Replace(webSiteUploadFolder + '\\', string.Empty));

                        var targetFolder = Path.GetDirectoryName(targetFilePath);

                        if (!Directory.Exists(targetFolder))
                        {
                            Directory.CreateDirectory(targetFolder);
                        }

                        File.Copy(iFilePath,
                            targetFilePath,
                            true);
                    });
                }

                if (!Directory.Exists(designerUploadFolderPath))
                {
                    Directory.CreateDirectory(designerUploadFolderPath);
                }

                File.WriteAllText(Path.Combine(designerUploadFolderPath, ".arsenal-keep"),
                    "This file is used to keep the folder. Please do not delete it.");
            }
            catch (Exception e)
            {
                Trace.Write(e.Message);
            }
        }

        _isCopyingWebSiteFilesToDesigner = false;
        _lastCopyWebSiteFilesToDesignerTime = DateTime.Now;
    }

    /// <summary>
    /// 获取水印模拟器的index.html路径
    /// </summary>
    /// <param name="uploadFilesFolderPath"></param>
    /// <returns></returns>
    public static string GetWatermarkEditorIndexHtmlPath(string uploadFilesFolderPath)
    {
        if (string.IsNullOrWhiteSpace(_watermarkEditorIndexHtmlPath))
        {
            _watermarkEditorIndexHtmlPath =
                Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location),
                    @"Resources\dist\watermark-editor\index.html");
        }

        if (!File.Exists(_watermarkEditorIndexHtmlPath))
        {
            MessageBox.Show("找不到插件目录，请联系管理员。（QQ群：879694503）", "发生错误");
            return null;
        }

        return _watermarkEditorIndexHtmlPath;
    }

    public static void SafeExecute(Action action)
    {
        try
        {
            action();
        }
        catch (Exception e)
        {
            Trace.Write(e.Message);

#if DEBUG
            throw;
#endif
        }
    }
}