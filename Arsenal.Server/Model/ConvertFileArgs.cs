namespace Arsenal.Server.Model;

/// <summary>
/// 转换文件的参数
/// </summary>
public class ConvertFileArgs
{
    /// <summary>
    /// 需要转换的URL
    /// </summary>
    public string Url { get; set; }

    /// <summary>
    /// 转换目标类型
    /// </summary>
    public string TargetFileType { get; set; }

    /// <summary>
    /// 强制更新
    /// </summary>
    public bool ForceUpdated { get; set; }
}