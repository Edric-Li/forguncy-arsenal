namespace Arsenal;

public enum ServerCommandOrderWeight
{
    DeleteFileCommand,
    GetFileFullPathCommand,
    GetFileDirectoryCommand,
    GetUploadRootDirectoryCommand,
    GettingTemporaryDirectoryCommand,
    CompressFilesIntoZipCommand,
    ExtractZipFileToDirectoryCommand,
    CreateDownloadLinkToFileCommand,
    CreateAccessLinkToFileCommand,
    CopyServerFileToArsenalFolderCommand,
    CopyServerFolderToArsenalFolderCommand,
    ListItemsCommand,
}