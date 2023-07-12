using Arsenal.Server.Model.Params;

namespace Arsenal.Server.Model;

public class FileMetaData
{
    public string TargetFolder { get; set; }
    
    public string FileName { get; set; }
    
    public ConflictStrategy ConflictStrategy { get; set; }
}