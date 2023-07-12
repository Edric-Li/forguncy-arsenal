namespace Arsenal.Server.Common;

public static class HttpClientHelper
{
    private static HttpClient _client;

    public static HttpClient Client => _client ??= new HttpClient(new HttpClientHandler()
    {
        ServerCertificateCustomValidationCallback = (_, _, _, _) => true,
    });
}
    
