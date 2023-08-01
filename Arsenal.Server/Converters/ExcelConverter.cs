using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using Excel;

namespace Arsenal.Server.Converters;

public class ExcelConverter
{
    public static readonly bool IsInstalled;

    private readonly string _filePath;

    private readonly string _savePath;

    private static readonly ProcessPoolManager ProcessPoolManager;

    static ExcelConverter()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var appType = Type.GetTypeFromProgID("KET.Application") ?? Type.GetTypeFromProgID("Excel.Application");

            IsInstalled = appType != null;

            if (IsInstalled)
            {
                ProcessPoolManager = new ProcessPoolManager(appType);
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

    public void ConvertToXlsx()
    {
        if (ProcessPoolManager == null)
        {
            new LibreOfficeConverter(_filePath, _savePath).ConvertToXlsx();
        }
        else
        {
            var processes = ProcessPoolManager.GetAvailableProcesses();

            try
            {
                var workbook = processes.Instance.Workbooks.Open(_filePath, ReadOnly: true);
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
                processes.Release();
                ProcessPoolManager.RemoveProcess(processes);
            }
        }
    }
}