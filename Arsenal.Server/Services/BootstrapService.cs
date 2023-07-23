using Arsenal.Server.DataBase;

namespace Arsenal.Server.Services;

/// <summary>
/// 引导服务
/// </summary>
public abstract class BootstrapService
{
    /// <summary>
    /// 确保初始化
    /// </summary>
    public static void EnsureInitialization()
    {
        try
        {
            Configuration.Configuration.Instance.EnsureInitialization();
            DatabaseInitializer.Instance.EnsureInitialization();
            CloudStorageService.EnsureInitialization();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}