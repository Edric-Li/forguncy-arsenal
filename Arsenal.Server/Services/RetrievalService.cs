using Arsenal.Server.Common;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Model.Result;
using Microsoft.EntityFrameworkCore;

namespace Arsenal.Server.Services;

/// <summary>
/// 检索服务
/// </summary>
public class RetrievalService : ServerBase
{
    /// <summary>
    /// 数据大的时候，此方法性能不好，后续有时间了在优化
    /// </summary>
    /// <param name="param"></param>
    /// <returns></returns>
    public async Task<List<ListItemsResult>> ListItemsAsync(ListItemsParam param)
    {
        var relativePath = param.RelativePath?.TrimStart('/') ?? string.Empty;

        var folderPath = SeparatorConverter.ConvertToDatabaseSeparator(relativePath);
        var folderDeep = relativePath.Count(c => c == '/');

        if (relativePath != "")
        {
            folderDeep += 1;
        }

        var fileList = await DatabaseContext.Files
            .Where(item => item.FolderPath.StartsWith(folderPath))
            .ToListAsync();

        var files = new List<ListItemsResult>();
        var folderNameWithSizeMap = new Dictionary<string, long>();

        foreach (var item in fileList)
        {
            if (item.FolderPath == relativePath)
            {
                files.Add(new ListItemsResult()
                {
                    Name = item.Name,
                    Size = item.Size,
                    Uploader = item.Uploader,
                    CreatedAt = item.CreatedAt,
                    ContentType = item.ContentType,
                });
            }
            else
            {
                var arr = item.FolderPath.Split("/");

                var folderName = arr[folderDeep];

                if (!folderNameWithSizeMap.ContainsKey(folderName))
                {
                    folderNameWithSizeMap.Add(folderName, item.Size);
                }
                else
                {
                    folderNameWithSizeMap[folderName] += item.Size;
                }
            }
        }

        var result = new List<ListItemsResult>();

        foreach (var dic in folderNameWithSizeMap)
        {
            result.Add(new ListItemsResult()
            {
                Name = dic.Key,
                Size = dic.Value,
                IsFolder = true,
            });
        }

        foreach (var file in files)
        {
            result.Add(file);
        }

        return result;
    }
}