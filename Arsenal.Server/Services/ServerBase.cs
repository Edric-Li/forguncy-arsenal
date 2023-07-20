using Arsenal.Server.DataBase;

namespace Arsenal.Server.Services;

public class ServerBase
{
    private DatabaseContext _databaseContext;

    protected DatabaseContext DatabaseContext => _databaseContext ??= new DatabaseContext();

    public void Dispose()
    {
        _databaseContext?.DisposeAsync();
    }
}