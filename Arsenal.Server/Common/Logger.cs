using System.Diagnostics;

namespace Arsenal.Server.Common;

/// <summary>
/// 日志记录器
/// </summary>
internal abstract class Logger
{
    /// <summary>
    /// 记录日志
    /// </summary>
    /// <param name="level"></param>
    /// <param name="message"></param>
    /// <param name="exception"></param>
    private static void Log(LogLevel level, string message, Exception exception = null)
    {
        var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        var logLevelString = level.ToString().ToUpper();
        var logMessage = $"[Arsenal] {timestamp} [{logLevelString}] {message}";

        if (exception != null)
        {
            logMessage += Environment.NewLine + $"Exception: {exception}";
        }

        Console.WriteLine(logMessage);
        Trace.WriteLine(logMessage);
    }

    /// <summary>
    /// 记录普通日志
    /// </summary>
    /// <param name="message"></param>
    public static void Information(string message)
    {
        Log(LogLevel.Information, message);
    }

    /// <summary>
    /// 记录错误日志
    /// </summary>
    /// <param name="message"></param>
    /// <param name="exception"></param>
    public static void Error(string message, Exception exception = null)
    {
        Log(LogLevel.Error, message, exception);
    }
}