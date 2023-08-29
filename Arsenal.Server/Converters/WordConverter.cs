using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using Word;
using Task = System.Threading.Tasks.Task;

namespace Arsenal.Server.Converters;

public class WordConverter
{
    private readonly string _filePath;

    private readonly string _savePath;

    private static NormaOfficeAppManager _normaOfficeAppManager;

    private static bool? _isInstalled;

    public static async Task<bool> CheckInstalledAsync()
    {
        if (_isInstalled.HasValue)
        {
            return _isInstalled.Value;
        }

        var isInstalled = await LibreOfficeConverter.CheckInstalledAsync();

        if (!isInstalled && RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var appType = Type.GetTypeFromProgID("KWPS.Application") ?? Type.GetTypeFromProgID("Word.Application");

            isInstalled = appType != null;

            if (isInstalled)
            {
                _normaOfficeAppManager = new NormaOfficeAppManager(appType);
            }
        }

        _isInstalled = isInstalled;

        return isInstalled;
    }

    public WordConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;
    }

    public async Task ConvertToPdfAsync()
    {
        if (_normaOfficeAppManager == null)
        {
            await new LibreOfficeConverter(_filePath, _savePath).ConvertToPdfAsync();
        }
        else
        {
            var app = await _normaOfficeAppManager.CreateOrGetAppAsync();

            try
            {
                var document = app.Documents.Open(_filePath, ReadOnly: true);
                document.SaveAs(_savePath, WdSaveFormat.wdFormatPDF);
                document.Close();

                Marshal.ReleaseComObject(document);
            }
            catch (Exception e)
            {
                Logger.Error("Word转换失败", e);
                throw;
            }
            finally
            {
                _normaOfficeAppManager.Release();
            }
        }
    }
}