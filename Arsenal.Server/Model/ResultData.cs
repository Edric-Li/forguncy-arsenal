namespace Arsenal.Server.Common;

public class ResultData
{
    public bool Result { get; set; }

    public string Message { get; set; }
    
    public Dictionary<string, object> Properties { get; set; }

}