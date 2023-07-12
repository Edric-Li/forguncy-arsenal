namespace Arsenal.Server.Model.HttpResult;

public class HttpFailureResult : HttpResult
{
    public HttpFailureResult(string message = null, object data = default)
    {
        Result = false;
        Message = message;
        Data = data;
    }
}