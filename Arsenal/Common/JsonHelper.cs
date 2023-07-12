using System;
using System.IO;
using Newtonsoft.Json;

namespace Arsenal.Common;

public static class JsonHelper
{
    public static T DeserializeFrom<T>(Stream stream)
    {
        return (T)DeserializeFrom(stream, typeof(T));
    }

    public static object DeserializeFrom(Stream stream, Type type = null)
    {
        using StreamReader sr = new(stream);
        using JsonTextReader reader = new(sr);
        var serializer = JsonSerializer.CreateDefault();
        return serializer.Deserialize(reader, type);
    }

    public static void SerializeTo(Stream stream, object content)
    {
        using StreamWriter sw = new(stream);
        using JsonTextWriter writer = new(sw);
        var serializer = JsonSerializer.CreateDefault();
        serializer.Serialize(writer, content);
    }
}