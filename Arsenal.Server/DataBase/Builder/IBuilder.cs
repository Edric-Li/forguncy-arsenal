namespace Arsenal.Server.DataBase.Builder;

/// <summary>
/// 数据库构建器
/// </summary>
public interface IBuilder
{
    /// <summary>
    /// 初始化数据库
    /// </summary>
    /// <param name="connectionString"></param>
    /// <returns></returns>
    Task InitializeAsync(string connectionString);
}
