using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using Excel;

namespace Arsenal.Server.Converters;

public class ExcelConverter
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
            var appType = Type.GetTypeFromProgID("KET.Application") ?? Type.GetTypeFromProgID("Excel.Application");

            isInstalled = appType != null;

            if (isInstalled)
            {
                _normaOfficeAppManager = new NormaOfficeAppManager(appType);
            }
        }

        _isInstalled = isInstalled;
        return isInstalled;
    }

    public ExcelConverter(string xlsPath, string savePath)
    {
        _filePath = xlsPath;
        _savePath = savePath;
    }

    public async Task ConvertToXlsxAsync()
    {
        if (_normaOfficeAppManager == null)
        {
            await new LibreOfficeConverter(_filePath, _savePath).ConvertToXlsxAsync();
            return;
        }

        var app = await _normaOfficeAppManager.CreateOrGetAppAsync();

        try
        {
            var workbook = app.Workbooks.Open(_filePath, ReadOnly: true);
            workbook.SaveAs(_savePath, XlFileFormat.xlOpenXMLWorkbook);
            workbook.Close();

            Marshal.ReleaseComObject(workbook);
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "Excel转换失败," + e.Message);
            throw;
        }
        finally
        {
            _normaOfficeAppManager.Release();
        }
    }
}