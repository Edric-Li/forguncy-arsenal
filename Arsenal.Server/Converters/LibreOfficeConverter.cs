using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using Arsenal.Server.Common;
using Arsenal.Server.Services;

namespace Arsenal.Server.Converters;

/// <summary>
/// LibreOffice转换器
/// </summary>
public class LibreOfficeConverter
{
    /// <summary>
    /// 程序名称
    /// </summary>
    private static readonly Lazy<string> ProgramNameLazy = new(() =>
        RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "soffice_safe.exe" : "libreoffice");

    /// <summary>
    /// 创建信号量，限制LibreOffice的并发数
    /// </summary>
    private static readonly SemaphoreSlim Semaphore = new(1, Math.Max(Environment.ProcessorCount / 2, 1));

    /// <summary>
    /// 文件路径
    /// </summary>
    private readonly string _filePath;

    /// <summary>
    /// 需要删除原文件
    /// </summary>
    private readonly bool _needDeleteOriginalFile;

    /// <summary>
    /// 保存路径
    /// </summary>
    private readonly string _savePath;

    /// <summary>
    /// 是否已经安装了LibreOffice
    /// </summary>
    private static bool? _isInstalled;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="filePath"></param>
    /// <param name="savePath"></param>
    public LibreOfficeConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;

        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(_filePath);

        // 在Linux系统下，如果文件名中包含空格或其他特殊字符，LibreOffice会报错
        if (OperatingSystem.IsLinux() && !FileUploadService.IsValidFileKey(fileNameWithoutExtension))
        {
            // 判断fileNameWithoutExtension中是否包含空格以及其他特殊字符
            if (Regex.IsMatch(fileNameWithoutExtension, @"[\s\p{P}]"))
            {
                var destFileName = Path.Combine(Configuration.Configuration.TempFolderPath,
                    Guid.NewGuid() + Path.GetExtension(filePath));

                File.Copy(_filePath, destFileName);

                _filePath = destFileName;
                _needDeleteOriginalFile = true;
            }
        }
        
    }

    /// <summary>
    /// 获取LibreOffice版本号
    /// </summary>
    /// <returns></returns>
    private static async Task<string> GetVersionAsync()
    {
        try
        {
            var processStartInfo = new ProcessStartInfo("libreoffice", "/c --version")
            {
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            using var process = new Process();
            process.StartInfo = processStartInfo;
            process.Start();

            var output = await process.StandardOutput.ReadToEndAsync();
            await process.WaitForExitAsync();

            var match = Regex.Match(output, @"LibreOffice ([\d.]+)");
            return match.Success ? match.Groups[1].Value : null;
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// 检查是否安装了LibreOffice
    /// </summary>
    /// <returns></returns>
    public static async Task<bool> CheckInstalledAsync()
    {
        if (_isInstalled != null)
        {
            return _isInstalled.Value;
        }

        // 如果是Windows系统，检查在默认安装路径下是否存在ffmpeg.exe
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var exists = File.Exists(@"C:\Program Files\LibreOffice\program\soffice_safe.exe");

            if (exists)
            {
                _isInstalled = true;
                return true;
            }
        }

        // 获取libreOffice版本号，如果能获取到，说明已经安装了ffmpeg
        var result = await GetVersionAsync();
        _isInstalled = result != null;
        return _isInstalled.Value;
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

        if (OperatingSystem.IsWindows())
        {
            process.WorkingDirectory = @"C:\Program Files\LibreOffice\program";
        }

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
            if (_needDeleteOriginalFile)
            {
                File.Delete(_filePath);
            }
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