using System.Diagnostics;
using System.Runtime.InteropServices;
using Arsenal.Server.Common;

namespace Arsenal.Server.Converters;

/// <summary>
/// LibreOffice转换器
/// </summary>
public class LibreOfficeConverter
{
    /// <summary>
    /// 是否安装了LibreOffice
    /// </summary>
    public static readonly bool IsInstalled;

    /// <summary>
    /// 程序名称
    /// </summary>
    private static readonly Lazy<string> ProgramNameLazy = new(() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "soffice_safe.exe" : "./soffice");

    /// <summary>
    /// 程序路径
    /// </summary>
    private static readonly Lazy<string> LibreOfficePathLazy = new(() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
            ? @"C:\Program Files\LibreOffice\program"
            : "/usr/lib/libreoffice/program");

    /// <summary>
    /// 创建信号量，限制LibreOffice的并发数
    /// </summary>
    private static readonly SemaphoreSlim Semaphore = new(1, Math.Max(Environment.ProcessorCount / 2, 1));

    /// <summary>
    /// 文件路径
    /// </summary>
    private readonly string _filePath;

    /// <summary>
    /// 保存路径
    /// </summary>
    private readonly string _savePath;

    /// <summary>
    /// 静态构造函数，来判断是否安装了LibreOffice
    /// </summary>
    static LibreOfficeConverter()
    {
        IsInstalled = File.Exists(Path.Combine(LibreOfficePathLazy.Value, ProgramNameLazy.Value));
    }

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="xlsPath"></param>
    /// <param name="savePath"></param>
    public LibreOfficeConverter(string xlsPath, string savePath)
    {
        _filePath = xlsPath;
        _savePath = savePath;
    }

    /// <summary>
    /// 创建转换进程
    /// </summary>
    /// <param name="convertTo"></param>
    /// <param name="outputDirectory"></param>
    /// <returns></returns>
    private ProcessStartInfo CreateProcessStartInfo(string convertTo, string outputDirectory)
    {
        var command =
            $"{ProgramNameLazy.Value} --headless --convert-to {convertTo} \"{_filePath}\" --outdir \"{outputDirectory}\"";

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

    /// <summary>
    /// 转换
    /// </summary>
    /// <param name="convertTo"></param>
    private async Task ConvertAsync(string convertTo)
    {
        await Semaphore.WaitAsync();

        try
        {
            var tempDirectory = Path.Combine(Configuration.Configuration.TempFolderPath, Guid.NewGuid().ToString());
            var processInfo = CreateProcessStartInfo(convertTo, tempDirectory);

            using var process = new Process();
            process.StartInfo = processInfo;
            process.Start();
            await process.WaitForExitAsync();
            var destFileName = Path.GetFileNameWithoutExtension(_filePath) + "." + convertTo;
            File.Move(Path.Combine(tempDirectory, destFileName), _savePath);
        }
        catch (Exception ex)
        {
            Logger.Log(LogLevel.ERROR, "转换过程中发生异常: " + ex.Message);
        }
        finally
        {
            Semaphore.Release();
        }
    }

    /// <summary>
    /// 转换为xlsx
    /// </summary>
    public async Task ConvertToXlsxAsync()
    {
        await ConvertAsync("xlsx");
    }

    /// <summary>
    /// 转换为pdf
    /// </summary>
    public async Task ConvertToPdfAsync()
    {
        await ConvertAsync("pdf");
    }
}