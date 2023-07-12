import FileUploadEngine from '../../common/file-upload-engine';

interface ICommandParam {
  fileName: string;
  result: string;
}

const getDownloadUrlCommand = (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;

  const fileNames = ctx.evaluateFormula(param.fileName)?.toString()?.split('|');

  const urlArray: string[] = [];

  for (const name of fileNames) {
    if (name) {
      urlArray.push(location.origin + FileUploadEngine.getDownloadUrl(name));
    }
  }

  Forguncy.CommandHelper.setVariableValue(param.result, urlArray.join('|'));
};

export default getDownloadUrlCommand;
