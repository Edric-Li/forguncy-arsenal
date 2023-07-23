namespace Arsenal.Server.Model;

public class ResultData
{
    /// <summary>
    /// API调用是否成功
    /// </summary>
    public bool Result { get; set; }

    /// <summary>
    /// API调用返回的消息
    /// </summary>
    public string Message { get; set; }

    /// <summary>
    /// API调用返回的数据
    /// </summary>
    public Dictionary<string, object> Properties { get; set; }

}