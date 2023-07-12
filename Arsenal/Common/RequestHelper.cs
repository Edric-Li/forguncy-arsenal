using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Arsenal.Common;

public abstract class RequestHelper
{
    private static async Task<HttpResult> CreateRequestAsync(HttpMethod method, string url, HttpContent content = null)
    {
        var httpMessage = new HttpRequestMessage(method, new Uri(url));

        httpMessage.Content = content;

        var response = await HttpClientHelper.Client.SendAsync(httpMessage);

        await using var stream = await response.Content.ReadAsStreamAsync();

        var result = JsonHelper.DeserializeFrom(stream, typeof(HttpResult)) as HttpResult;

        return result;
    }

    public static string GetApiUrl(string appBaseUrl, string apiName)
    {
        return appBaseUrl + "customapi/arsenal/" + apiName;
    }

    public static async Task<HttpResult> PostAsync(string url, HttpContent content)
    {
        return await CreateRequestAsync(HttpMethod.Post, url, content);
    }
}