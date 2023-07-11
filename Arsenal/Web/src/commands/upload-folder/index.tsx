import React from 'react';
import ReactDOM from 'react-dom/client';
import UploadFolderCommandWrapper from '../../components/wrapper/upload-folder-command';

const uploadFolderCommand = (ctx: Forguncy.Plugin.CommandBase) => {
  const dom = document.createElement('div');
  ReactDOM.createRoot(dom).render(<UploadFolderCommandWrapper ctx={ctx} />);
};

export default uploadFolderCommand;
