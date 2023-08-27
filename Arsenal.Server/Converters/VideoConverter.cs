using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using Arsenal.Server.Common;

namespace Arsenal.Server.Converters;

public class VideoConverter
{
    private readonly string _filePath;

    private readonly string _savePath;

    private static bool? _isInstalled;

    private static readonly SemaphoreSlim Semaphore = new(1, Math.Max(Environment.ProcessorCount / 2, 1));

    private static async Task<string> GetFFmpegVersionAsync()
    {
        try
        {
            var processStartInfo = new ProcessStartInfo("ffmpeg", "/c -version")
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

            const string versionPattern = @"ffmpeg version (\S+)";
            var match = Regex.Match(output, versionPattern);
            return match.Success ? match.Groups[1].Value : null;
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// 检查是否安装了ffmpeg
    /// </summary>
    /// <returns></returns>
    public static async Task<bool> CheckInstalledAsync()
    {
        if (_isInstalled.HasValue)
        {
            return _isInstalled.Value;
        }

        // 如果是Windows系统，检查在默认安装路径下是否存在ffmpeg.exe
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            var exists = File.Exists(Path.Combine(@"C:\Program Files\ffmpeg\bin", "ffmpeg.exe"));

            if (exists)
            {
                _isInstalled = true;
                return true;
            }
        }

        // 获取ffmpeg版本号，如果能获取到，说明已经安装了ffmpeg
        var result = await GetFFmpegVersionAsync();

        _isInstalled = result != null;
        return _isInstalled.Value;
    }

    public VideoConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;
    }

    /// <summary>
    /// 转换视频格式为H264
    /// </summary>
    public async Task ConvertToH264Async()
    {
        await Semaphore.WaitAsync();

        try
        {
            var ffmpegCommand = $"ffmpeg -i \"{_filePath}\" -c:v libx264 \"{_savePath}\"";

            ProcessStartInfo processStartInfo;

            if (OperatingSystem.IsWindows())
            {
                // Windows 系统
                processStartInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {ffmpegCommand}",
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WorkingDirectory = @"C:\Program Files\ffmpeg\bin"
                };
            }
            else if (OperatingSystem.IsLinux())
            {
                // Linux 系统
                processStartInfo = new ProcessStartInfo
                {
                    FileName = "/bin/bash",
                    Arguments = $"-c \"{ffmpegCommand}\"",
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
            }
            else
            {
                Logger.Log(LogLevel.ERROR, "不支持的操作系统");
                return;
            }

            var process = new Process
            {
                StartInfo = processStartInfo
            };
            process.Start();

            await process.WaitForExitAsync();

            process.Close();
            process.Dispose();
        }
        finally
        {
            Semaphore.Release();
        }
    }
}