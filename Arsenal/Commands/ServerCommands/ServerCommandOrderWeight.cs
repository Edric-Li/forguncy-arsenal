namespace Arsenal;

public enum ServerCommandOrderWeight
{
    DeleteFileCommand,
    GetUploadRootDirectoryCommand,
    GettingTemporaryDirectoryCommand,
    CompressFilesIntoZipCommand,
    ExtractZipFileToDirectoryCommand,
    GetFileFullPathCommand,
    GetFileDirectoryCommand,
    CreateDownloadLinkToFileCommand,
    CreateAccessLinkToFileCommand,
    CopyServerFileToArsenalFolderCommand,
    CopyServerFolderToArsenalFolderCommand,
    ListItemsCommand,
}