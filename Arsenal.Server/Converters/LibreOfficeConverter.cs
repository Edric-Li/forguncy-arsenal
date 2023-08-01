using System.Diagnostics;
using System.Runtime.InteropServices;
using Arsenal.Server.Common;

namespace Arsenal.Server.Converters;

public class LibreOfficeConverter
{
    public static readonly bool IsInstalled;

    private static readonly Lazy<string> ProgramNameLazy = new(() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "soffice_safe.exe" : "./soffice");

    private static readonly Lazy<string> LibreOfficePathLazy = new(() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
            ? @"C:\Program Files\LibreOffice\program"
            : "/usr/lib/libreoffice/program");

    private readonly string _filePath;

    private readonly string _savePath;

    static LibreOfficeConverter()
    {
        IsInstalled = File.Exists(Path.Combine(LibreOfficePathLazy.Value, ProgramNameLazy.Value));
    }

    public LibreOfficeConverter(string xlsPath, string savePath)
    {
        _filePath = xlsPath;
        _savePath = savePath;
    }

    private ProcessStartInfo CreateProcessStartInfo(string convertTo)
    {
        var command =
            $"{ProgramNameLazy.Value} --headless --convert-to {convertTo} \"{_filePath}\" --outdir \"{Path.GetDirectoryName(_savePath)}\"";

        var process = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
            ? new ProcessStartInfo("cmd.exe", "/c " + command)
            : new ProcessStartInfo("/bin/bash", $"-c \"{command}\"");

        process.WorkingDirectory = LibreOfficePathLazy.Value;
        process.CreateNoWindow = true;
        process.UseShellExecute = false;
        process.RedirectStandardOutput = true;
        process.RedirectStandardError = true;

        return process;
    }

    private void Convert(string convertTo)
    {
        try
        {
            var processInfo = CreateProcessStartInfo(convertTo);

            using var process = new Process();
            process.StartInfo = processInfo;
            process.Start();
            process.WaitForExit();
        }
        catch (Exception ex)
        {
            Logger.Log(LogLevel.ERROR, "转换过程中发生异常: " + ex.Message);
        }
    }

    public void ConvertToXlsx()
    {
        Convert("xlsx");
    }

    public void ConvertToPdf()
    {
        Convert("pdf");
    }
}