namespace Arsenal;

public enum ServerCommandOrderWeight
{
    GetUploadRootDirectoryCommand,
    GettingTemporaryDirectoryCommand,
    CompressFilesIntoZipCommand,
    ExtractZipFileToDirectoryCommand,
    CreateDownloadLinkToFileCommand,
    DeleteFileCommand,
    GetFileFullPathCommand,
    GetFileDirectoryCommand,
    UploadServerFolderCommand,
}