﻿using System.Xml;
using Arsenal.Server.Model;
using Newtonsoft.Json.Linq;

namespace Arsenal.Server.Configuration;

/// <summary>
/// 全局配置解析器
/// </summary>
public abstract class GlobalConfigParser
{
    /// <summary>
    /// Xml根节点
    /// </summary>
    private static XmlElement _xmlElement;

    /// <summary>
    /// 获取ForguncyServer的根目录
    /// </summary>
    /// <returns></returns>
    private static string GetForguncyServerFolder()
    {
        return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonDocuments), "ForguncyServer");
    }

    /// <summary>
    /// 获取GlobalConfig.xml的路径
    /// </summary>
    private static string GetGlobalConfigXmlPath => Path.Combine(GetForguncyServerFolder(), "GlobalConfig.xml");

    /// <summary>
    /// 通过xpath获取xml文档中的值
    /// </summary>
    /// <param name="xPath"></param>
    /// <returns></returns>
    private static string GetGlobalValueByXPath(string xPath)
    {
        var xmlNodeList = _xmlElement?.SelectNodes("/GlobalConfiguration/" + xPath);

        if (xmlNodeList is null)
        {
            return string.Empty;
        }

        return xmlNodeList[0]?.InnerText ?? string.Empty;
    }

    /// <summary>
    /// 获取全局存储类型
    /// </summary>
    /// <returns></returns>
    private static string GetGlobalStorageType()
    {
        return GetGlobalValueByXPath("StorageType");
    }

    /// <summary>
    /// 获取全局存储路径
    /// </summary>
    /// <returns></returns>
    private static string GetGlobalUploadFolderPath()
    {
        return GetGlobalValueByXPath("UploadRootPath");
    }

    /// <summary>
    /// 获取全局是否使用公开的URL
    /// </summary>
    /// <returns></returns>
    private static string GetGlobalUsePublicUrl()
    {
        return GetGlobalValueByXPath("UsePublicUrl");
    }

    /// <summary>
    /// 根据AppName获取App的根目录
    /// </summary>
    /// <returns></returns>
    private static string GetAppRootPath(string appName)
    {
        var value = GetGlobalValueByXPath("AppRootPath");
        var parent = string.IsNullOrWhiteSpace(value) ? GetForguncyServerFolder() : value;
        return Path.Combine(parent, appName);
    }

    /// <summary>
    /// 获取节点获取AppName
    /// </summary>
    /// <param name="node"></param>
    /// <returns></returns>
    private static string GetAppNameByXmlNode(XmlNode node)
    {
        return node.Attributes?.GetNamedItem("AppName")?.Value;
    }

    /// <summary>
    /// 获取是否启用用户服务SSL
    /// </summary>
    /// <returns></returns>
    private static bool GetEnableUserServiceSsl()
    {
        var xmlNodeList = _xmlElement?.SelectNodes("/GlobalConfiguration/UserService/EnableUserServiceSSL");

        if (xmlNodeList is null)
        {
            return false;
        }

        return xmlNodeList[0]?.InnerText == "true";
    }

    /// <summary>
    /// 根据AppName获取App的存储信息（全局配置中存储的原始存储信息，并没计算继承关系）
    /// </summary>
    /// <param name="appName"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
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

    /// <summary>
    /// 获取UserService的URL 
    /// </summary>
    /// <param name="appRootPath"></param>
    /// <exception cref="ArgumentNullException"></exception>
    /// <returns></returns>
    private static string GetUserServiceUrl(string appRootPath)
    {
        var serverInfosFilePath = Path.Combine(appRootPath, "Files", "Forguncy_ServerInfos");
        var jsonContent = File.ReadAllText(serverInfosFilePath);
        var jsonObject = JObject.Parse(jsonContent);

        var userServiceUrl = (string)jsonObject["UserServiceURL"] ?? Configuration.DefaultUserServiceUrl;
        if (userServiceUrl == null)
        {
            throw new ArgumentNullException(nameof(userServiceUrl));
        }

        var enableUserServiceSsl = GetEnableUserServiceSsl();

        return enableUserServiceSsl
            ? userServiceUrl.Replace("http://", "https://")
            : userServiceUrl.Replace("https://", "http://");
    }

    /// <summary>
    /// 根据AppName获取App的配置信息
    /// </summary>
    /// <param name="appName"></param>
    /// <returns></returns>
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

        appConfig.RootPath = GetAppRootPath(appName);

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

        if (string.IsNullOrWhiteSpace(appStorageInfo.UploadFolderPath) &&
            (!string.IsNullOrWhiteSpace(globalUploadFolderPath) || appStorageInfo.StorageType != null))
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