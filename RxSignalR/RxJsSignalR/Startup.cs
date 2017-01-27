using Microsoft.Owin;
using Microsoft.Owin.Cors;

using RxJsSignalR;

[assembly: OwinStartup(typeof(Startup))]

namespace RxJsSignalR
{
    using Owin;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);

            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}