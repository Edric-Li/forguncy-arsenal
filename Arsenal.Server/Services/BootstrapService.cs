using Arsenal.Server.DataBase;

namespace Arsenal.Server.Services;

public abstract class BootstrapServices
{
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