using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using Word;
using Task = System.Threading.Tasks.Task;

namespace Arsenal.Server.Converters;

public class WordConverter
{
    public static readonly bool IsInstalled;

    private readonly string _filePath;

    private readonly string _savePath;

    private static readonly NormaOfficeAppManager NormaOfficeAppManager;

    static WordConverter()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var appType = Type.GetTypeFromProgID("KWPS.Application") ?? Type.GetTypeFromProgID("Word.Application");

            IsInstalled = appType != null;

            if (IsInstalled)
            {
                NormaOfficeAppManager = new NormaOfficeAppManager(appType);
            }
        }

        if (!IsInstalled)
        {
            IsInstalled = LibreOfficeConverter.IsInstalled;
        }
    }

    public WordConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;
    }

    public async Task ConvertToPdfAsync()
    {
        if (NormaOfficeAppManager == null)
        {
            await new LibreOfficeConverter(_filePath, _savePath).ConvertToPdfAsync();
        }
        else
        {
            var app = await NormaOfficeAppManager.CreateOrGetAppAsync();

            try
            {
                var document = app.Documents.Open(_filePath, ReadOnly: true);
                document.SaveAs(_savePath, WdSaveFormat.wdFormatPDF);
                document.Close();

                Marshal.ReleaseComObject(document);
            }
            catch (Exception e)
            {
                Logger.Log(LogLevel.ERROR, "Word转换失败," + e.Message);
                throw;
            }
            finally
            {
                NormaOfficeAppManager.Release();
            }
        }
    }
}