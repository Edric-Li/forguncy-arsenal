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

    private static readonly NormaOfficeAppManager NormaOfficeAppManager;

    static PptConverter()
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var appType = Type.GetTypeFromProgID("KWPP.Application") ??
                          Type.GetTypeFromProgID("PowerPoint.Application");

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

    public PptConverter(string pptPath, string savePath)
    {
        _filePath = pptPath;
        _savePath = savePath;
    }

    public async Task ConvertToPdfAsync()
    {
        if (NormaOfficeAppManager == null)
        {
            await new LibreOfficeConverter(_filePath, _savePath).ConvertToPdfAsync();
            return;
        }

        var app = await NormaOfficeAppManager.CreateOrGetAppAsync();

        try
        {
            var presentation = app.Presentations.Open(_filePath, WithWindow: MsoTriState.msoFalse,
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
            NormaOfficeAppManager.Release();
        }
    }
}