using Arsenal.WebApi.Middlewares;
using GrapeCity.Forguncy.ServerApi;
using Microsoft.AspNetCore.Builder;

namespace Arsenal.WebApi;

public class ArsenalMiddlewareInjector : MiddlewareInjector
{
    public override List<MiddlewareItem> Configure(List<MiddlewareItem> middlewareItems, IApplicationBuilder app)
    {
        middlewareItems.Insert(0, new MiddlewareItem()
        {
            Id = "2eb703ef-7afd-4970-a1f3-85ccc57deaab",
            ConfigureMiddleWareAction = () => { app.UseMiddleware<Middleware>(); },
            Description = "Arsenal Middleware"
        });

        return base.Configure(middlewareItems, app);
    }
}