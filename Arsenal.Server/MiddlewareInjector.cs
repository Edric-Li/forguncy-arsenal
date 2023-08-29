using Arsenal.Server.Middlewares;
using Arsenal.Server.Provider;
using GrapeCity.Forguncy.ServerApi;

namespace Arsenal.Server;

public class ArsenalMiddlewareInjector : MiddlewareInjector
{
    public override List<MiddlewareItem> Configure(List<MiddlewareItem> middlewareItems, IApplicationBuilder app)
    {
        middlewareItems.Insert(0, new MiddlewareItem()
        {
            Id = "2eb703ef-7afd-4970-a1f3-85ccc57deaab",
            ConfigureMiddleWareAction = () =>
            {
                app.UseMiddleware<Middleware>();

                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new UploadFileProvider(),
                    ServeUnknownFileTypes = true,
                    RequestPath = "/Upload",
                });

                app.UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new ConvertedFileProvider(),
                    ServeUnknownFileTypes = true,
                    RequestPath = "/converted-file"
                });
            },
            Description = "Arsenal Middleware"
        });

        return base.Configure(middlewareItems, app);
    }
}