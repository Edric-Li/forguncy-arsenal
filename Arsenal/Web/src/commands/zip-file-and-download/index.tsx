import requestHelper from '../../common/request-helper';
import FileUploadEngine from '../../common/file-upload-engine';

interface ICommandParam {
  fileNames: string;
  downloadFileName: string;
}

const zipFileAndDownload = async (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;
  const fileStr = ctx.evaluateFormula(param.fileNames)?.toString();
  const zipName = ctx.evaluateFormula(param.downloadFileName)?.toString();

  if (!fileStr) {
    return;
  }
  const res = await requestHelper.compressFilesIntoZip({
    fileIds: fileStr.split('|'),
    zipName,
  });

  if (res.data) {
    FileUploadEngine.download(res.data);
  }
};
export default zipFileAndDownload;
