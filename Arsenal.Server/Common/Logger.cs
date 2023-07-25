using System.Diagnostics;

namespace Arsenal.Server.Common;

internal abstract class Logger
{
    public static void Log(LogLevel level, string message, Exception exception = null)
    {
        var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        var logLevelString = level.ToString().ToUpper();
        var logMessage = $"[Arsenal] {timestamp} [{logLevelString}] {message}";

        if (exception != null)
        {
            logMessage += Environment.NewLine + $"Exception: {exception}";
        }

        Trace.WriteLine(logMessage);
    }
}

internal enum LogLevel
{
    DEBUG,
    INFO,
    WARNING,
    ERROR,
    FATAL
}