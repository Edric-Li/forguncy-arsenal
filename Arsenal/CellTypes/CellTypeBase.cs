using System.Collections.Generic;
using Arsenal.Common;
using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;

namespace Arsenal;

public class CellTypeBase : CellType, INeedUploadFileByUser, IForceGenerateCell
{
    public List<FileCopyInfo> GetAllFileSourceAndTargetPathsWhenImportForguncyFile(IFileUploadContext context)
    {
        return new List<FileCopyInfo>(0);
    }

    public FileUploadInfo GetUploadFileInfosWhenSaveFile(IFileUploadContext context)
    {
        CommonUtils.SafeExecute(() =>
        {
            CommonUtils.InitWorkingDirectoryByIFileUploadContext(context);
            CommonUtils.BackupDatabaseFile();
            CommonUtils.CopyWebSiteFilesToDesigner();
        });

        return null;
    }

    public IEnumerable<GenerateCellInfo> GetForceGenerateCells()
    {
        CommonUtils.SafeExecute(CommonUtils.BackupDatabaseFile);
        yield break;
    }
}