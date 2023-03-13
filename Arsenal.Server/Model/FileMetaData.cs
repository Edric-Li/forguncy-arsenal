using Arsenal.WebApi.Model.Params;

namespace Arsenal.WebApi.Model;

public class FileMetaData
{
    public string? TargetFolder { get; set; }
    
    public string FileName { get; set; }
    
    public ConflictStrategy ConflictStrategy { get; set; }
}