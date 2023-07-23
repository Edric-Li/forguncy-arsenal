using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Windows;
using Microsoft.Web.WebView2.Core;

namespace Arsenal.WpfControls;

public partial class WatermarkEditor : Window
{
    public WatermarkEditor(string indexHtmlPath)
    {
        var userDataFolder = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

        userDataFolder = Path.Combine(userDataFolder, "ForguncyWebView2",
            Path.GetFileName(
                    Path.GetFullPath(
                        Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "..")))
                .Replace("ForguncyPlugin", ""));

        if (IsAdmin())
        {
            userDataFolder = Path.Combine(userDataFolder, "Admin");
        }

        Loaded += async (sender, args) =>
        {
            var task = await CoreWebView2Environment.CreateAsync(
                @"..\DesignerResources\WebView2Runtime", userDataFolder, null);
            await webView.EnsureCoreWebView2Async(task);
            webView.Source = new Uri(indexHtmlPath);
        };
        InitializeComponent();
    }

    private static bool IsAdmin()
    {
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return true;
        }

        var id = WindowsIdentity.GetCurrent();
        var p = new WindowsPrincipal(id);
        return p.IsInRole(WindowsBuiltInRole.Administrator);
    }
}