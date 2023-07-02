using System.Text;
using Newtonsoft.Json;

namespace Arsenal.Server.Common;

public class JsonContent : StringContent
{
    public JsonContent(object data) : base(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json")
    {
    }
}