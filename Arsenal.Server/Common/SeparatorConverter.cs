namespace Arsenal.Server.Common;

/// <summary>
/// 分隔符转换器
/// </summary>
public abstract class SeparatorConverter
{
    /// <summary>
    /// 转换为数据库分隔符
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    public static string ConvertToDatabaseSeparator(string path)
    {
        return path.Replace("\\", "/");
    }

    /// <summary>
    /// 转换为系统分隔符
    /// </summary>
    /// <param name="path"></param>
    /// <returns></returns>
    public static string ConvertToSystemSeparator(string path)
    {
        return path.Replace("/", Path.DirectorySeparatorChar.ToString());
    }
}