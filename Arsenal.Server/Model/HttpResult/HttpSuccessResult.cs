namespace Arsenal.WebApi.Model.HttpResult;

public class HttpSuccessResult : HttpResult
{
    public HttpSuccessResult(object? data = null, string? message = null)
    {
        Result = true;
        Data = data;
        Message = message;
    }
}