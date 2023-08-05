using System.Runtime.InteropServices;
using System.Text;
using Arsenal.Server.Common;
using ZWCAD;

namespace Arsenal.Server.Converters;

/// <summary>
/// 中望CAD转换器
/// </summary>
public class ZWCADConverter
{
    /// <summary>
    /// 是否安装了ZWCAD
    /// </summary>
    public static readonly bool IsInstalled;

    /// <summary>
    /// ZWCAD应用程序(单例)
    /// </summary>
    private static ZcadApplication _app;

    /// <summary>
    /// 销毁应用程序的定时器
    /// </summary>
    private static Timer _destroyApplicationTimer;

    /// <summary>
    /// 打印完成的标志
    /// </summary>
    private static bool _plotCompleted;

    /// <summary>
    /// 限制ZWCAD应用程序的并发数
    /// </summary>
    private static readonly SemaphoreSlim Semaphore = new(1, 1);

    /// <summary>
    /// 文件路径
    /// </summary>
    private readonly string _filePath;

    /// <summary>
    /// 保存路径
    /// </summary>
    private readonly string _savePath;

    /// <summary>
    /// 静态构造函数
    /// 来判断是否安装了ZWCAD
    /// </summary>
    static ZWCADConverter()
    {
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return;
        }

        IsInstalled = Type.GetTypeFromProgID("ZWCAD.Application") != null;
    }

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="filePath"></param>
    /// <param name="savePath"></param>
    public ZWCADConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;
    }

    /// <summary>
    /// 生成scr文件
    /// 目前只考虑了打印模型的情况
    /// 并未考虑布局的情况
    /// </summary>
    /// <param name="scrFilePath"></param>
    private async Task CreateScrFileAsync(string scrFilePath)
    {
        var sn = new StringBuilder();
        // 命令
        sn.AppendLine("-PLOT");
        // 是否需要详细打印配置
        sn.AppendLine("Y");
        // 输入布局或模型,目前只支持模型
        sn.AppendLine("Model");
        // 输入输出设备的名称
        sn.AppendLine("DWG to PDF.pc5");
        // 输入图纸尺寸
        sn.AppendLine("");
        // 输入图纸单位
        sn.AppendLine("");
        // 输入图形方向
        sn.AppendLine("");
        // 是否反向打印
        sn.AppendLine("");
        //输入打印区域
        sn.AppendLine("E");
        //输入打印比例
        sn.AppendLine("");
        // 输入打印偏移
        sn.AppendLine("");
        // 是否按样式打印
        sn.AppendLine("");
        // 输入打印样式表名称
        sn.AppendLine(".");
        // 是否打印线宽
        sn.AppendLine("N");
        // 是否着色打印设置
        sn.AppendLine("");
        // 输入文件名
        sn.AppendLine(_savePath);
        //是否保存对页面设置的更改
        sn.AppendLine("N");
        // 是否继续打印
        sn.AppendLine("Y");

        await File.WriteAllTextAsync(scrFilePath, sn.ToString());
    }

    /// <summary>
    /// 销毁应用程序
    /// </summary>
    /// <param name="state"></param>
    private static void DestroyApplication(object state)
    {
        try
        {
            _app.BeginPlot -= ApplicationOnBeginPlot;
            _app.EndPlot -= ApplicationOnEndPlot;
            _app?.Quit();
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "销毁ZWCAD应用程序失败" + e.Message);
        }
    }

    /// <summary>
    /// 创建销毁应用程序的定时器
    /// </summary>
    private static void CreateDestroyApplicationTimer()
    {
        _destroyApplicationTimer = new Timer(DestroyApplication, null, 60000, Timeout.Infinite);
    }

    /// <summary>
    /// 清除销毁应用程序的定时器
    /// </summary>
    private static void ClearDestroyApplicationTimer()
    {
        _destroyApplicationTimer?.Dispose();
    }

    /// <summary>
    /// 应用程序开始退出
    /// </summary>
    /// <param name="cancel"></param>
    private static void ApplicationOnBeginQuit(ref bool cancel)
    {
        _app = null;
    }

    /// <summary>
    /// 开始打印
    /// </summary>
    private static void ApplicationOnBeginPlot(string documentName)
    {
        _plotCompleted = false;
    }

    /// <summary>
    /// 结束打印
    /// </summary>
    private static void ApplicationOnEndPlot(string documentName)
    {
        _plotCompleted = true;
    }

    /// <summary>
    /// 创建或获取应用程序
    /// </summary>
    /// <returns></returns>
    private static ZcadApplication CreateOrGetApplication()
    {
        if (_app != null)
        {
            return _app;
        }

        _app = new ZcadApplication
        {
            Visible = false,
        };

        _app.BeginQuit += ApplicationOnBeginQuit;
        _app.BeginPlot += ApplicationOnBeginPlot;
        _app.EndPlot += ApplicationOnEndPlot;

        return _app;
    }

    /// <summary>
    /// 转换为PDF
    /// </summary>
    public async Task ConvertToPdfAsync()
    {
        await Semaphore.WaitAsync();

        try
        {
            _plotCompleted = false;

            ClearDestroyApplicationTimer();

            // 临时的scr文件，之所以需要创建一个scr文件，是因为不会用命令....
            var scrFilePath = Path.Combine(Configuration.Configuration.TempFolderPath, $"{Guid.NewGuid()}.scr");

            await CreateScrFileAsync(scrFilePath);

            try
            {
                var app = CreateOrGetApplication();

                var zdocument = app.Documents.Open(_filePath, true);
                zdocument.PostCommand($"_scr {scrFilePath}\n");

                var startTime = DateTime.Now;

                while (true)
                {
                    if (DateTime.Now - startTime > TimeSpan.FromSeconds(300))
                    {
                        throw new Exception("转换超时");
                    }

                    if (!_plotCompleted)
                    {
                        await Task.Delay(500);
                        continue;
                    }

                    break;
                }

                zdocument.Close(false, null);
            }
            catch (Exception e)
            {
                Logger.Log(LogLevel.ERROR, "ZWCAD转换失败," + e.Message);
                throw;
            }
            finally
            {
                File.Delete(scrFilePath);
                CreateDestroyApplicationTimer();
            }
        }
        finally
        {
            Semaphore.Release();
        }
    }
}