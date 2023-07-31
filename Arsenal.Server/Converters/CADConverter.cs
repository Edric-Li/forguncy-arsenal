using Aspose.CAD;
using Aspose.CAD.ImageOptions;

namespace Arsenal.Server.Converters;

public class CadConverter
{
    private readonly string _filePath;

    private readonly string _savePath;

    public CadConverter(string pptPath, string savePath)
    {
        _filePath = pptPath;
        _savePath = savePath;
    }

    public void ConvertToPdf()
    {
        using var cadImage = Image.Load(_filePath);
        var rasterizationOptions = new CadRasterizationOptions();

        var pdfOptions = new PdfOptions
        {
            VectorRasterizationOptions = rasterizationOptions
        };

        cadImage.Save(_savePath, pdfOptions);
    }
}