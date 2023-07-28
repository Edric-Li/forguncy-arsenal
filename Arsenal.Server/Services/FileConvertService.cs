using Arsenal.Server.Converters;

namespace Arsenal.Server.Services;

public class FileConvertService
{
    private readonly string _fileKey;

    private readonly string _filePath;

    private static readonly HashSet<string> SupportedFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".ppt",
        ".pptx",
        ".xls",
        ".doc",
        ".docx",
    };

    public FileConvertService(string fileKey, string filePath)
    {
        _fileKey = fileKey;
        _filePath = filePath;

        if (!Directory.Exists(Configuration.Configuration.ConvertedFolderPath))
        {
            Directory.CreateDirectory(Configuration.Configuration.ConvertedFolderPath);
        }
    }

    /// <summary>
    /// 尝试转换文件
    /// </summary>
    /// <param name="convertedFilePath"></param>
    /// <returns></returns>
    public bool TryConvertFileAsync(out string convertedFilePath)
    {
        convertedFilePath = null;

        var extension = Path.GetExtension(_filePath).ToLower();

        if (!SupportedFileExtensions.Contains(extension))
        {
            return false;
        }

        if (extension.StartsWith(".ppt"))
        {
            if (!PptConverter.IsInstalled)
            {
                return false;
            }

            var savePath = Path.Combine(Configuration.Configuration.ConvertedFolderPath, _fileKey + ".pdf");

            if (!File.Exists(savePath))
            {
                new PptConverter(_filePath, savePath).ConvertToPdf();
            }

            convertedFilePath = savePath;
            return true;
        }

        if (extension == ".xls")
        {
            if (!ExcelConverter.IsInstalled)
            {
                return false;
            }

            var savePath = Path.Combine(Configuration.Configuration.ConvertedFolderPath, _fileKey + ".xlsx");

            if (!File.Exists(savePath))
            {
                new ExcelConverter(_filePath, savePath).ConvertToXlsx();
            }

            convertedFilePath = savePath;
            return true;
        }

        if (extension.StartsWith(".doc"))
        {
            if (!WordConverter.IsInstalled)
            {
                return false;
            }

            var savePath = Path.Combine(Configuration.Configuration.ConvertedFolderPath, _fileKey + ".pdf");

            if (!File.Exists(savePath))
            {
                new WordConverter(_filePath, savePath).ConvertToPdf();
            }

            convertedFilePath = savePath;
            return true;
        }

        return false;
    }
}