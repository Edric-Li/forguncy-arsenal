import FileUploadEngine from '../../common/file-upload-engine';
import sleep from '../../common/sleep';

interface ICommandParam {
  fileKeys: string;
}

const downloadFileCommand = async (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;
  const fileKeys = ctx.evaluateFormula(param.fileKeys)?.toString()?.split('|');

  for (const name of fileKeys) {
    if (name) {
      FileUploadEngine.download(name);
      await sleep(100);
    }
  }
};

export default downloadFileCommand;
