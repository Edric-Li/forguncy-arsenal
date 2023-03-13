using System.Xml;
using Arsenal.WebApi.Model;

namespace Arsenal.WebApi.Configuration;

public abstract class GlobalConfiguration
{
    private static XmlElement? _xmlElement;

    private static string GetCommonDocumentsFolder()
    {
        return Environment.GetFolderPath(Environment.SpecialFolder.CommonDocuments);
    }

    private static string GetGlobalConfigXmlPath => Path.Combine(GetCommonDocumentsFolder(), "GlobalConfig.xml");

    private static string GetGlobalValueByXPath(string xPath)
    {
        var xmlNodeList = _xmlElement?.SelectNodes("/GlobalConfiguration/" + xPath);

        if (xmlNodeList is null)
        {
            return string.Empty;
        }

        return xmlNodeList[0]?.InnerText ?? string.Empty;
    }

    private static string GetGlobalStorageType()
    {
        return GetGlobalValueByXPath("StorageType");
    }

    private static string GetGlobalUploadFolderPath()
    {
        return GetGlobalValueByXPath("UploadFolderPath");
    }

    private static string? GetAppNameByXmlNode(XmlNode node)
    {
        return node.Attributes?.GetNamedItem("AppName")?.Value;
    }

    private static (string, string) GetUploadFolderPathAndStorageTypeByAppName(string appName)
    {
        var listNodes = _xmlElement?.SelectNodes("/GlobalConfiguration/Apps/AppConfiguration");

        if (listNodes is null)
        {
            throw new ArgumentException("listNodes is null");
        }

        var storageType = "";

        var uploadFolderPath = "";

        foreach (var item in listNodes)
        {
            if (item is not XmlNode node)
            {
                continue;
            }

            if (GetAppNameByXmlNode(node) != appName)
            {
                continue;
            }

            var childNodes = node.ChildNodes;

            foreach (var child in childNodes)
            {
                if (child is not XmlNode childNode)
                {
                    continue;
                }

                switch (childNode.Name)
                {
                    case "StorageType":
                        storageType = childNode.InnerText;
                        continue;

                    case "UploadFolderPath":
                        uploadFolderPath = childNode.InnerText;
                        continue;
                }
            }

            break;
        }

        return (uploadFolderPath, storageType);
    }

    public static AppConfig GetAppConfig(string appName)
    {
        var appConfig = new AppConfig();

        var doc = new XmlDocument();

        doc.Load(GetGlobalConfigXmlPath);

        _xmlElement = doc.DocumentElement;

        var globalStorageType = GetGlobalStorageType();

        var globalUploadFolderPath = GetGlobalUploadFolderPath();

        var (uploadFolderPath, storageType) = GetUploadFolderPathAndStorageTypeByAppName(appName);

        var defaultLocalUploadFolderPath = Path.Combine(GetCommonDocumentsFolder(), appName, "Upload");

        // 如果应用的存储类型为空，则使用全局的存储类型
        if (storageType == string.Empty)
        {
            storageType = globalStorageType;
        }

        // 如果存储类型为LOCAL-STORAGE，则使用本地存储
        if (storageType == "LOCAL-STORAGE")
        {
            storageType = null;
        }

        // 如果上传路径为空，则使用全局+应用名的路径+Upload
        if (uploadFolderPath == string.Empty)
        {
            uploadFolderPath = $"{globalUploadFolderPath}/{appName}/Upload";
        }

        // 是云存储,那么LocalUploadFolderPath的值就是默认值
        if (storageType != null)
        {
            appConfig.LocalUploadFolderPath = defaultLocalUploadFolderPath;
        }
        else
        {
            appConfig.LocalUploadFolderPath =
                uploadFolderPath == string.Empty ? defaultLocalUploadFolderPath : uploadFolderPath;
            appConfig.CloudStorageUploadFolderPath = uploadFolderPath;
        }

        appConfig.StorageType = storageType;

        return appConfig;
    }
}