namespace Arsenal.Server.Services;

public abstract class BootstrapServices
{
    public static void EnsureInitialization()
    {
        Configuration.Configuration.Instance.EnsureInitialization();
        DataAccess.DataAccess.Instance.EnsureInitialization();
        CloudStorageService.EnsureInitialization();
    }
}