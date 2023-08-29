using Arsenal.Server.Provider;

namespace Arsenal.Server.Services;

/// <summary>
/// 缓存服务
/// </summary>
/// <typeparam name="T"></typeparam>
public class CacheService<T>
{
    /// <summary>
    /// 缓存键前缀
    /// </summary>
    private readonly string _prefix;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="prefix">缓存键前缀</param>
    public CacheService(string prefix)
    {
        _prefix = prefix;
    }

    /// <summary>
    /// 获取缓存键
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    private string GetKey(string key)
    {
        return $"ARSENAL:{_prefix}:{key}";
    }

    /// <summary>
    /// 设置缓存
    /// </summary>
    /// <param name="key"></param>
    /// <param name="value"></param>
    public void Set(string key, T value)
    {
        CacheServiceProvider.ServiceProvider.Replace(GetKey(key), value, TimeSpan.FromMinutes(30));
    }

    /// <summary>
    /// 获取缓存
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    /// <exception cref="KeyNotFoundException"></exception>
    public T Get(string key)
    {
        var value = CacheServiceProvider.ServiceProvider.Get<T>(GetKey(key));

        return value ?? default;
    }
}