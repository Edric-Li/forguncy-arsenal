using Arsenal.Server.Common;
using Arsenal.Server.Model.HttpResult;
using Arsenal.Server.Model.Params;
using Arsenal.Server.Services;
using GrapeCity.Forguncy.ServerApi;

namespace Arsenal.Server.Controllers;

public class ArsenalConsole : ForguncyApi
{
    [Post]
    public async Task ListItems()
    {
        await Context.HandleErrorAsync(async () =>
        {
            var body = await Context.ParseBodyAsync<ListItemsParam>();

            var result = await new ConsoleService().ListItemsAsync(body.RelativePath?.TrimStart('/') ?? string.Empty);

            Context.BuildResult(new HttpSuccessResult(result));
        });
    }
}