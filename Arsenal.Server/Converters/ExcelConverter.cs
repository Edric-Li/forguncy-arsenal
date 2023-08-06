using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using Excel;

namespace Arsenal.Server.Converters;

public class ExcelConverter
{
    public static readonly bool IsInstalled;

    private readonly string _filePath;

    private readonly string _savePath;

    private static readonly NormaOfficeAppManager NormaOfficeAppManager;

    static ExcelConverter()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var appType = Type.GetTypeFromProgID("KET.Application") ?? Type.GetTypeFromProgID("Excel.Application");

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

    public ExcelConverter(string xlsPath, string savePath)
    {
        _filePath = xlsPath;
        _savePath = savePath;
    }

    public async Task ConvertToXlsxAsync()
    {
        if (NormaOfficeAppManager == null)
        {
            await new LibreOfficeConverter(_filePath, _savePath).ConvertToXlsxAsync();
            return;
        }

        var app = await NormaOfficeAppManager.CreateOrGetAppAsync();

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
            NormaOfficeAppManager.Release();
        }
    }
}