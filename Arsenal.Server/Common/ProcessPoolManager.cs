namespace Arsenal.Server.Common;

/// <summary>
/// 进程池管理器
/// 后续还可以加入进程池的数量限制
/// </summary>
public class ProcessPoolManager
{
    private readonly Type _type;

    private readonly object _getAvailableProcessesLock = new();

    private List<ProcessInformation> AllProcesses { get; } = new();

    public ProcessPoolManager(Type type)
    {
        _type = type;
    }

    public ProcessInformation GetAvailableProcesses()
    {
        lock (_getAvailableProcessesLock)
        {
            foreach (var instanceInfo in AllProcesses.Where(instanceInfo => !instanceInfo.IsUsed))
            {
                instanceInfo.IsUsed = true;
                return instanceInfo;
            }
        }

        dynamic newInstance = Activator.CreateInstance(_type);

        newInstance!.DisplayAlerts = false;

        var newInstanceInfo = new ProcessInformation
        {
            Instance = newInstance,
            IsUsed = true,
        };
        AllProcesses.Add(newInstanceInfo);
        return newInstanceInfo;
    }

    public void RemoveProcess(ProcessInformation processInformation)
    {
        AllProcesses.Remove(processInformation);
    }
}

public class ProcessInformation
{
    public bool IsUsed { get; set; }

    public dynamic Instance { get; set; }

    public void Release()
    {
        try
        {
            Instance.Quit();
            Instance = null;
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.ERROR, "释放进程失败," + e.Message);
        }
    }
}