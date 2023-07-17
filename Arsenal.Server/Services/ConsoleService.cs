using Arsenal.Server.Common;
using Arsenal.Server.DataBase;
using Arsenal.Server.Model;
using Arsenal.Server.Model.Result;
using Microsoft.EntityFrameworkCore;

namespace Arsenal.Server.Services;

public class ConsoleService : IDisposable
{
    private DatabaseContext _databaseContext;

    private DatabaseContext DatabaseContext => _databaseContext ??= new DatabaseContext();

    /// <summary>
    /// 数据大的时候，此方法性能不好，后续有时间了在优化
    /// </summary>
    /// <param name="relativePath"></param>
    /// <returns></returns>
    public async Task<ListItemsResult> ListItemsAsync(string relativePath)
    {
        var folderPath = SeparatorConverter.ConvertToDatabaseSeparator(relativePath);
        var folderDeep = relativePath.Count(c => c == '/');

        if (relativePath != "")
        {
            folderDeep += 1;
        }

        var fileList = await DatabaseContext.Files
            .Where(item => item.FolderPath.StartsWith(folderPath))
            .ToListAsync();

        var files = new List<ListFileItemModel>();
        var folderMap = new Dictionary<string, ListFolderItemModel>();

        foreach (var item in fileList)
        {
            if (item.FolderPath == relativePath)
            {
                files.Add(new ListFileItemModel()
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

                if (!folderMap.ContainsKey(folderName))
                {
                    folderMap.Add(folderName, new ListFolderItemModel()
                    {
                        Name = folderName,
                        Size = item.Size,
                    });
                }
                else
                {
                    folderMap[folderName].Size += item.Size;
                }
            }
        }

        return new ListItemsResult()
        {
            Files = files,
            Folders = folderMap.Values.ToList()
        };
    }

    public void Dispose()
    {
        _databaseContext?.DisposeAsync();
    }
}