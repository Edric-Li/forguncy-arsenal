import FileUploadEngine from '../../common/file-upload-engine';

interface ICommandParam {
  fileKeys: string;
  result: string;
}

const getDownloadUrlCommand = (ctx: Forguncy.Plugin.CommandBase) => {
  const param = ctx.CommandParam as ICommandParam;

  const fileKeys = ctx.evaluateFormula(param.fileKeys)?.toString()?.split('|');

  const urlArray: string[] = [];

  for (const name of fileKeys) {
    if (name) {
      urlArray.push(location.origin + FileUploadEngine.getDownloadUrl(name));
    }
  }

  Forguncy.CommandHelper.setVariableValue(param.result, urlArray.join('|'));
};

export default getDownloadUrlCommand;
