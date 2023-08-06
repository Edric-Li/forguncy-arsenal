using Aspose.CAD;
using Aspose.CAD.ImageOptions;

namespace Arsenal.Server.Converters;

public class AsposeCadConverter
{
    private readonly string _filePath;

    private readonly string _savePath;

    public AsposeCadConverter(string filePath, string savePath)
    {
        _filePath = filePath;
        _savePath = savePath;
    }

    public async Task ConvertToPdfAsync()
    {
        using var cadImage = Image.Load(_filePath);

        var rasterizationOptions = new CadRasterizationOptions()
        {
            Layouts = new[] { "Model" }
        };

        var pdfOptions = new PdfOptions
        {
            VectorRasterizationOptions = rasterizationOptions
        };

        await cadImage.SaveAsync(_savePath, pdfOptions);
    }
}