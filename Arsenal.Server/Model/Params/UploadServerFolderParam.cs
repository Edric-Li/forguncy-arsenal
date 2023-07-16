namespace Arsenal.Server.Model.Params;

public class UploadServerFolderParam
{
    public string Name { get; set; }

    public string FolderPath { get; set; }

    public long Size { get; set; }

    public string Ext { get; set; }
}