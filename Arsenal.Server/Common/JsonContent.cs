using System.Text;
using Newtonsoft.Json;

namespace Arsenal.Server.Common;

public class CustomJsonContent : StringContent
{
    public CustomJsonContent(object data) : base(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json")
    {
    }
}