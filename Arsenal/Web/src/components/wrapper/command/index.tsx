import _ from 'lodash';
import uploadCommand from '../../../commands/upload';
import uploadFolderCommand from '../../../commands/upload-folder';
import downloadFileCommand from '../../../commands/download-file';
import getFileAccessUrlCommand from '../../../commands/get-file-access-url';
import getDownloadUrlCommand from '../../../commands/get-download-url';

interface Props {
  commandName: string;
  commandBase: Forguncy.Plugin.CommandBase;
}

const commandWrapper = (props: Props): Function | null => {
  let fn: Function | null = null;

  if (props.commandName === 'Upload') {
    fn = uploadCommand;
  }

  if (props.commandName === 'UploadFolder') {
    fn = uploadFolderCommand;
  }

  if (props.commandName === 'DownloadFile') {
    fn = downloadFileCommand;
  }

  if (props.commandName === 'GetFileAccessUrl') {
    fn = getFileAccessUrlCommand;
  }

  if (props.commandName === 'GetDownloadUrl') {
    fn = getDownloadUrlCommand;
  }

  return (fn || _.noop).bind(null, props.commandBase);
};
export default commandWrapper;
