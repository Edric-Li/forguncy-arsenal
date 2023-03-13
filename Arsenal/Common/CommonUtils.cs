using System.IO;
using System.Linq;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal.Common;

public abstract class CommonUtils
{
    /// <summary>
    /// 获取指定层级的父级目录
    /// </summary>
    /// <param name="folderPath"></param>
    /// <param name="num"></param>
    /// <returns></returns>
    public static DirectoryInfo GetFolderSpecifyParent(string folderPath, int num)
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
        var workFolder = GetFolderSpecifyParent(context.GetForguncyUserTemplateFolderLocalPath(), 4).FullName;

        var designerUploadFolderPath = Path.Combine(workFolder, "Designer", "Upload");
        var webSiteUploadFolder = Path.Combine(workFolder, "WebSite", "Upload");
        var webSiteUploadArsenalFolder = Path.Combine(webSiteUploadFolder, "arsenal");

        var allUsedUploadFilePaths = Directory
            .GetFiles(webSiteUploadArsenalFolder, "*.*", SearchOption.AllDirectories)
            .ToList();

        foreach (var iFilePath in allUsedUploadFilePaths)
        {
            File.Copy(iFilePath,
                Path.Combine(designerUploadFolderPath, iFilePath.Replace(webSiteUploadFolder + '\\', string.Empty)),
                true);
        }

        File.WriteAllText(Path.Combine(designerUploadFolderPath, ".arsenal-keep"), string.Empty);
    }
}