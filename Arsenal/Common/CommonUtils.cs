using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal.Common;

public abstract class CommonUtils
{
    private static bool _isCopyingWebSiteFilesToDesigner;

    private static readonly object CopyWebSiteFilesToDesignerLock = new();
    
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

    public static void CopyWebSiteFilesToDesigner(IFileUploadContext context)
    {
        if (_isCopyingWebSiteFilesToDesigner)
        {
            return;
        }

        lock (CopyWebSiteFilesToDesignerLock)
        {
            try
            {
                _isCopyingWebSiteFilesToDesigner = true;

                var workFolder = GetFolderSpecifyParent(context.GetForguncyUserTemplateFolderLocalPath(), 4).FullName;

                var designerUploadFolderPath = Path.Combine(workFolder, "Designer", "Upload");
                var webSiteUploadFolder = Path.Combine(workFolder, "WebSite", "Upload");
                var webSiteUploadArsenalFolder = Path.Combine(webSiteUploadFolder, "arsenal");

                if (Directory.Exists(webSiteUploadArsenalFolder))
                {
                    var allUsedUploadFilePaths = Directory
                        .GetFiles(webSiteUploadArsenalFolder, "*.*", SearchOption.AllDirectories)
                        .ToList();

                    foreach (var iFilePath in allUsedUploadFilePaths)
                    {
                        if (iFilePath.Contains("sqlite3--shm") || iFilePath.Contains("sqlite3--wal"))
                        {
                            continue;
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
                    }
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
    }
}