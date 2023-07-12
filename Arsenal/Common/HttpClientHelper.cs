using System.Net.Http;
using System.Threading;

namespace Arsenal.Common;

public static class HttpClientHelper
{
    private static HttpClient _client;

    public static HttpClient Client
    {
        get
        {
            return _client ??= new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (_, _, _, _) => true,
            })
            {
                Timeout = Timeout.InfiniteTimeSpan
            };
        }
    }
}