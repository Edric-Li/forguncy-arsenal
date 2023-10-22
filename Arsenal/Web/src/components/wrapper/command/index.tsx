import uploadCommand from '../../../commands/upload';
import uploadFolderCommand from '../../../commands/upload-folder';
import downloadFileCommand from '../../../commands/download-file';
import getFileAccessUrlCommand from '../../../commands/get-file-access-url';
import getDownloadUrlCommand from '../../../commands/get-download-url';
import zipFileAndDownload from '../../../commands/zip-file-and-download';
import getDifferenceFileKeys from '../../../commands/get-difference-file-keys';
import videoOperationCommand from '../../../commands/video-operation';
import noop from '../../../common/noop';
import PreviewFileCommand from '../../../commands/preview-file-command';

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

  if (props.commandName === 'ZipFileAndDownload') {
    fn = zipFileAndDownload;
  }

  if (props.commandName === 'GetDifferenceFileKeys') {
    fn = getDifferenceFileKeys;
  }

  if (props.commandName === 'VideoOperation') {
    fn = videoOperationCommand;
  }

  if (props.commandName === 'PreviewFileCommand') {
    fn = PreviewFileCommand;
  }

  return (fn || noop).bind(null, props.commandBase);
};
export default commandWrapper;
