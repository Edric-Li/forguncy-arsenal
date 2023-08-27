using System.Runtime.InteropServices;
using Arsenal.Server.Common;
using PowerPoint;

namespace Arsenal.Server.Converters;

/// <summary>
/// PPT转换器
/// </summary>
public class PptConverter
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
            var appType = Type.GetTypeFromProgID("KWPP.Application") ??
                          Type.GetTypeFromProgID("PowerPoint.Application");

            isInstalled = appType != null;

            if (isInstalled)
            {
                _normaOfficeAppManager = new NormaOfficeAppManager(appType);
            }
        }

        _isInstalled = isInstalled;
        return isInstalled;
    }

    public PptConverter(string pptPath, string savePath)
    {
        _filePath = pptPath;
        _savePath = savePath;
    }

    public async Task ConvertToPdfAsync()
    {
        if (_normaOfficeAppManager == null)
        {
            await new LibreOfficeConverter(_filePath, _savePath).ConvertToPdfAsync();
            return;
        }

        var app = await _normaOfficeAppManager.CreateOrGetAppAsync();

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
            _normaOfficeAppManager.Release();
        }
    }
}