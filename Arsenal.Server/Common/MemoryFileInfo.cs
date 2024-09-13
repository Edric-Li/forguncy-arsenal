using Microsoft.Extensions.FileProviders;

namespace Arsenal.Server.Common;

internal class MemoryFileInfo : IFileInfo
{
    private readonly MemoryStream _readStream;

    public MemoryFileInfo(string path)
    {
        Name = Path.GetFileName(path);
        _readStream = new MemoryStream();
        using var fs = new FileStream(path, FileMode.Open, FileAccess.Read);
        fs.CopyTo(_readStream);

        _readStream.Position = 0;
        _readStream.Seek(0, SeekOrigin.Begin);

        LastModified = DateTimeOffset.UtcNow;
        Length = _readStream.Length;
    }

    public bool Exists => true;

    public long Length { get; }

    public string PhysicalPath => null;

    public string Name { get; }

    public DateTimeOffset LastModified { get; }

    public bool IsDirectory => false;

    public Stream CreateReadStream()
    {
        return _readStream;
    }
}
