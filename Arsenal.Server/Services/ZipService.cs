using System.IO.Compression;

namespace Arsenal.Server.Services;

public abstract class ZipService
{
    public static List<string> GetZipEntries(string zipFilePath)
    {
        using var archive = ZipFile.OpenRead(zipFilePath);
        return archive.Entries.Select(entry => entry.FullName).ToList();
    }

    public static void ExtractFileFromZip(string zipPath, string extractPath, string targetFile)
    {
        using var archive = ZipFile.OpenRead(zipPath);
        var entry = archive.GetEntry(targetFile.TrimStart('/'));

        if (entry != null)
        {
            using var entryStream = entry.Open();
            using var fileStream = new FileStream(extractPath, FileMode.OpenOrCreate);
            entryStream.CopyTo(fileStream);
        }
    }
}