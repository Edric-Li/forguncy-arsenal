using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using GrapeCity.Forguncy.Plugin;
using Newtonsoft.Json;

namespace Arsenal.Common;

public abstract class CommonUtils
{
    private static bool _isCopyingWebSiteFilesToDesigner;

    private static string _watermarkEditorIndexHtmlPath;

    private static readonly object CopyWebSiteFilesToDesignerLock = new();

    private static ConcurrentDictionary<Type, Dictionary<string, string>> _jsonMetaDataCache = new();

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

    public static Dictionary<string, string> GetPropertyPaths(Type type, string parentKeyPath = "",
        string parentPath = "")
    {
        if (_jsonMetaDataCache.TryGetValue(type, out var value))
        {
            return value;
        }

        var propertyPaths = new Dictionary<string, string>();

        foreach (var property in type.GetProperties())
        {
            var displayName = property.GetCustomAttribute<DisplayNameAttribute>()?.DisplayName;

            displayName = string.IsNullOrEmpty(parentKeyPath) ? displayName : $"{parentKeyPath}.{displayName}";

            if (!string.IsNullOrEmpty(displayName))
            {
                var propertyName1 = property.GetCustomAttribute<JsonPropertyAttribute>()?.PropertyName;

                var propertyName = string.IsNullOrEmpty(parentPath)
                    ? propertyName1
                    : $"{parentPath}.{propertyName1}";

                if (property.PropertyType.IsClass && property.PropertyType != typeof(string))
                {
                    var nestedProperties = GetPropertyPaths(property.PropertyType, displayName, propertyName);
                    foreach (var nestedProperty in nestedProperties)
                    {
                        propertyPaths.Add(nestedProperty.Key, nestedProperty.Value);
                    }
                }
                else
                {
                    propertyPaths.Add(displayName, propertyName);
                }
            }
        }

        _jsonMetaDataCache.TryAdd(type, propertyPaths);
        return propertyPaths;
    }

    /// <summary>
    /// 获取水印模拟器的index.html路径
    /// </summary>
    /// <param name="uploadFilesFolderPath"></param>
    /// <returns></returns>
    public static string GetWatermarkEditorIndexHtmlPath(string uploadFilesFolderPath)
    {
        if (!string.IsNullOrWhiteSpace(_watermarkEditorIndexHtmlPath))
        {
            return _watermarkEditorIndexHtmlPath;
        }

        var pluginFolderPath = Path.Combine(GetFolderSpecifyParent(uploadFilesFolderPath, 2).FullName, "Plugin");

        var directories = Directory.GetDirectories(pluginFolderPath, "*", SearchOption.TopDirectoryOnly);

        foreach (var directory in directories)
        {
            var pluginJsonPath = Path.Combine(directory, "PluginConfig.json");

            if (!File.Exists(pluginJsonPath))
            {
                continue;
            }

            var pluginConfig = JsonConvert.DeserializeObject<PluginConfig>(File.ReadAllText(pluginJsonPath));

            if (pluginConfig.Guid == "8748d7dc-994d-45b8-80f9-f510cfcac6ac")
            {
                _watermarkEditorIndexHtmlPath =
                    Path.Combine(directory, "Resources\\dist\\watermark-editor\\index.html");
                return _watermarkEditorIndexHtmlPath;
            }
        }

        return null;
    }
}