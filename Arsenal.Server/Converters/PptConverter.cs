using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using PowerPoint;

namespace Arsenal.Server.Converters;

/// <summary>
/// PPT转换器
/// </summary>
public class PptConverter
{
    public static readonly bool IsInstalled;

    private readonly string _filePath;

    private readonly string _savePath;

    private static readonly ProcessPoolManager ProcessPoolManager;

    static PptConverter()
    {
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return;
        }

        var appType = Type.GetTypeFromProgID("KWPP.Application") ?? Type.GetTypeFromProgID("PowerPoint.Application");

        IsInstalled = appType != null;

        if (IsInstalled)
        {
            ProcessPoolManager = new ProcessPoolManager(appType);
        }
    }

    public PptConverter(string pptPath, string savePath)
    {
        _filePath = pptPath;
        _savePath = savePath;
    }

    public void ConvertToPdf()
    {
        ConvertPptToPdfWithOffice();
    }

    private void ConvertPptToPdfWithOffice()
    {
        var processes = ProcessPoolManager.GetAvailableProcesses();

        try
        {
            var presentation = processes.Instance.Presentations.Open(_filePath, WithWindow: MsoTriState.msoFalse,
                ReadOnly: MsoTriState.msoTrue);
            presentation.SaveAs(_savePath, PpSaveAsFileType.ppSaveAsPDF, MsoTriState.msoTrue);
            presentation.Close();

            Marshal.ReleaseComObject(presentation);
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "PPT转换失败," + e.Message);
            throw;
        }
        finally
        {
            processes.Release();
            ProcessPoolManager.RemoveProcess(processes);
        }
    }
}