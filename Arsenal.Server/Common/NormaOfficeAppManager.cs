namespace Arsenal.Server.Common;

/// <summary>
/// Wps、Office应用程序管理器
/// </summary>
public class NormaOfficeAppManager
{
    /// <summary>
    /// 类型
    /// </summary>
    private readonly Type _type;

    /// <summary>
    /// 销毁应用程序的定时器
    /// </summary>
    private Timer _destroyApplicationTimer;

    /// <summary>
    /// 应用程序
    /// </summary>
    private dynamic _app;

    /// <summary>
    /// 限制应用程序的并发数
    /// </summary>
    private readonly SemaphoreSlim _semaphore = new(1, 1);

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="type"></param>
    public NormaOfficeAppManager(Type type)
    {
        _type = type;
    }

    /// <summary>
    /// 创建销毁应用程序的定时器
    /// </summary>
    private void CreateDestroyAppTimer()
    {
        _destroyApplicationTimer = new Timer(DestroyApplication, null, 60000, Timeout.Infinite);
    }

    /// <summary>
    /// 销毁应用程序
    /// </summary>
    /// <param name="state"></param>
    private void DestroyApplication(object state)
    {
        try
        {
            _app.Quit();
            _app = null;
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "销毁ZWCAD应用程序失败" + e.Message);
        }
    }

    /// <summary>
    /// 清除销毁应用程序的定时器
    /// </summary>
    private void ClearDestroyAppTimer()
    {
        _destroyApplicationTimer?.Dispose();
    }

    /// <summary>
    /// 创建或获取应用程序
    /// </summary>
    /// <returns></returns>
    public async Task<dynamic> CreateOrGetAppAsync()
    {
        await _semaphore.WaitAsync();

        ClearDestroyAppTimer();

        if (_app == null)
        {
            _app = Activator.CreateInstance(_type);
            _app!.DisplayAlerts = false;
        }

        return _app;
    }

    /// <summary>
    /// 释放进程
    /// </summary>
    public void Release()
    {
        try
        {
            CreateDestroyAppTimer();
            _semaphore.Release();
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "释放进程失败" + e.Message);
        }
    }
}