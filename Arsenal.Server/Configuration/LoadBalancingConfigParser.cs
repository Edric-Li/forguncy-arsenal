using System.Xml;

namespace Arsenal.Server.Configuration;

/// <summary>
/// 负载均衡配置解析器
/// </summary>
public abstract class LoadBalancingConfigParser
{
    private static bool EnableLoadBalancing { get; set; }

    private static string LoadBalancingShareStoragePath { get; set; }

    static LoadBalancingConfigParser()
    {
        var forguncyServerFolder = GlobalConfigParser.GetForguncyServerFolder();

        var configFilePath = Path.Combine(forguncyServerFolder, "LoadBalancingConfig.xml");

        if (!File.Exists(configFilePath))
        {
            return;
        }

        var doc = new XmlDocument();

        doc.Load(configFilePath);

        var rootNode = doc.DocumentElement;

        if (rootNode == null)
        {
            return;
        }

        var enableLoadBalancingNode = rootNode.SelectSingleNode("/LoadBalancingConfiguration/EnableLoadBalancing");

        if (enableLoadBalancingNode?.InnerText == "true")
        {
            EnableLoadBalancing = true;

            var loadBalancingShareStoragePathNode =
                rootNode.SelectSingleNode("/LoadBalancingConfiguration/LoadBalancingShareStoragePath");

            LoadBalancingShareStoragePath = loadBalancingShareStoragePathNode?.InnerText;
        }
    }

    /// <summary>
    /// 是否启用负载均衡
    /// </summary>
    /// <returns></returns>
    public static bool IsLoadBalancingEnabled()
    {
        return EnableLoadBalancing;
    }

    /// <summary>
    /// 获取应用根目录
    /// </summary>
    /// <returns></returns>
    public static string GetAppRootFolderPath()
    {
        return Path.Combine(LoadBalancingShareStoragePath, "ForguncyApp");
    }

    /// <summary>
    /// 获取全局配置文件路径
    /// </summary>
    /// <returns></returns>
    public static string GetGlobalConfigFilePath()
    {
        return Path.Combine(LoadBalancingShareStoragePath, "UserService", "Config", "GlobalConfig.xml");
    }
}