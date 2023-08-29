using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Primitives;
using static System.GC;

namespace Arsenal.Server.Common;

public class PhysicalFileProviderWrapper : IFileProvider, IDisposable
{
    private bool _disposed;

    private readonly Lazy<PhysicalFileProvider> _innerProviderLazy;

    protected PhysicalFileProviderWrapper(Lazy<PhysicalFileProvider> innerProviderLazy)
    {
        _innerProviderLazy = innerProviderLazy;
    }

    private PhysicalFileProvider InnerProvider => _innerProviderLazy.Value;

    public IDirectoryContents GetDirectoryContents(string subpath)
    {
        return InnerProvider.GetDirectoryContents(subpath);
    }

    public virtual IFileInfo GetFileInfo(string subpath)
    {
        return InnerProvider.GetFileInfo(subpath);
    }

    public IChangeToken Watch(string filter)
    {
        return InnerProvider.Watch(filter);
    }

    ~PhysicalFileProviderWrapper()
    {
        Dispose(false);
    }

    public void Dispose()
    {
        Dispose(true);

        SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed)
        {
            return;
        }

        if (disposing)
        {
            // Dispose managed resources.
        }

        // Dispose unmanaged resources.
        InnerProvider?.Dispose();

        _disposed = true;
    }
}