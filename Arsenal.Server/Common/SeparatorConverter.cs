namespace Arsenal.Server.Common;

public class SeparatorConverter
{
    public static string ConvertToDatabaseSeparator(string path)
    {
        return path.Replace("\\", "/");
    }

    public static string ConvertToSystemSeparator(string path)
    {
        return path.Replace("/", Path.DirectorySeparatorChar.ToString());
    }
}