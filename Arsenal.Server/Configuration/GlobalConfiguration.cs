using System.Xml;
using Arsenal.Server.Model;
using Newtonsoft.Json.Linq;

namespace Arsenal.Server.Configuration;

public abstract class GlobalConfiguration
{
    private static XmlElement _xmlElement;

    private static string GetForguncyServerFolder()
    {
        return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonDocuments), "ForguncyServer");
    }

    private static string GetGlobalConfigXmlPath => Path.Combine(GetForguncyServerFolder(), "GlobalConfig.xml");

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
        return GetGlobalValueByXPath("UploadRootPath");
    }

    private static string GetGlobalUsePublicUrl()
    {
        return GetGlobalValueByXPath("UsePublicUrl");
    }

    private static string GetGlobalAppRootPath()
    {
        var value = GetGlobalValueByXPath("AppRootPath");
        return string.IsNullOrWhiteSpace(value) ? null : value;
    }

    private static string GetAppNameByXmlNode(XmlNode node)
    {
        return node.Attributes?.GetNamedItem("AppName")?.Value;
    }

    private static bool GetEnableUserServiceSsl()
    {
        var xmlNodeList = _xmlElement?.SelectNodes("/GlobalConfiguration/UserService/EnableUserServiceSSL");

        if (xmlNodeList is null)
        {
            return false;
        }

        return xmlNodeList[0]?.InnerText == "true";
    }

    private static AppStorageInfo GetAppAppStorageInfoByAppName(string appName)
    {
        var appStorageInfo = new AppStorageInfo();

        var listNodes = _xmlElement?.SelectNodes("/GlobalConfiguration/Apps/AppConfiguration");

        if (listNodes is null)
        {
            throw new ArgumentException("listNodes is null");
        }

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
                        appStorageInfo.StorageType = childNode.InnerText;
                        continue;

                    case "UploadFolderPath":
                        appStorageInfo.UploadFolderPath = childNode.InnerText;
                        continue;

                    case "UsePubicUrl":
                        if (!string.IsNullOrWhiteSpace(childNode.InnerText))
                        {
                            appStorageInfo.UsePubicUrl = childNode.InnerText == "true";
                        }
                        continue;
                }
            }

            break;
        }

        return appStorageInfo;
    }

    private static string GetUserServiceUrl(string appRootPath)
    {
        var serverInfosFilePath = Path.Combine(appRootPath, "Files", "Forguncy_ServerInfos");
        var jsonContent = File.ReadAllText(serverInfosFilePath);
        var jsonObject = JObject.Parse(jsonContent);

        var userServiceURL = (string)jsonObject["UserServiceURL"] ?? Configuration.DefaultUserServiceUrl;
        var enableUserServiceSSL = GetEnableUserServiceSsl();

        return enableUserServiceSSL
            ? userServiceURL.Replace("http://", "https://")
            : userServiceURL.Replace("https://", "http://");
    }

    public static AppConfig GetAppConfig(string appName)
    {
        var appConfig = new AppConfig();

        var doc = new XmlDocument();

        doc.Load(GetGlobalConfigXmlPath);

        _xmlElement = doc.DocumentElement;

        var globalStorageType = GetGlobalStorageType();

        var globalUploadFolderPath = GetGlobalUploadFolderPath();

        var globalUsePublicUrl = GetGlobalUsePublicUrl();

        var appStorageInfo = GetAppAppStorageInfoByAppName(appName);

        appConfig.RootPath = appConfig.RootPath =
            Path.Combine(GetGlobalAppRootPath() ?? GetForguncyServerFolder(), appName);

        var defaultLocalUploadFolderPath = Path.Combine(appConfig.RootPath, "Upload");

        // 如果应用的存储类型为空，则使用全局的存储类型
        if (appStorageInfo.StorageType == string.Empty)
        {
            appStorageInfo.StorageType = globalStorageType;
        }

        // 如果存储类型为LOCAL-STORAGE，则使用本地存储
        if (appStorageInfo.StorageType == "LOCAL-STORAGE")
        {
            appStorageInfo.StorageType = null;
        }

        if (appStorageInfo.UploadFolderPath == string.Empty &&
            (globalUploadFolderPath != string.Empty || appStorageInfo.StorageType != null))
        {
            appStorageInfo.UploadFolderPath = $"{globalUploadFolderPath}/{appName}/";
        }

        // 是云存储,那么LocalUploadFolderPath的值就是默认值
        if (appStorageInfo.StorageType != null)
        {
            appConfig.UseCloudStorage = true;
            appConfig.LocalUploadFolderPath = defaultLocalUploadFolderPath;
            appConfig.CloudStorageUploadFolderPath = appStorageInfo.UploadFolderPath;
            appConfig.UsePublicUrl = appStorageInfo.UsePubicUrl ?? globalUsePublicUrl == "true";
        }
        else
        {
            appConfig.LocalUploadFolderPath =
                string.IsNullOrEmpty(appStorageInfo.UploadFolderPath)
                    ? defaultLocalUploadFolderPath
                    : appStorageInfo.UploadFolderPath;
        }

        appConfig.StorageType = appStorageInfo.StorageType;
        appConfig.UserServiceUrl = GetUserServiceUrl(appConfig.RootPath);

        return appConfig;
    }
}