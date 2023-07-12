import FileUploadEngine from '../../common/file-upload-engine';
import sleep from '../../common/sleep';

interface ICommandParam {
  fileName: string;
}

const downloadFileCommand = async (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;
  const fileNames = ctx.evaluateFormula(param.fileName)?.toString()?.split('|');

  for (const name of fileNames) {
    if (name) {
      FileUploadEngine.download(name);
      await sleep(100);
    }
  }
};

export default downloadFileCommand;
