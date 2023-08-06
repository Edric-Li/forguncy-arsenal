namespace Arsenal;

public enum ServerCommandOrderWeight
{
    PdfOperationCommand,
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