namespace Arsenal.Server.Services;

public abstract class BootstrapServices
{
    public static void EnsureInitialization()
    {
        try
        {
            Configuration.Configuration.Instance.EnsureInitialization();
            DataAccess.DataAccess.Instance.EnsureInitialization();
            CloudStorageService.EnsureInitialization();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}