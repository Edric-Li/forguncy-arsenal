import React from 'react';
import ReactDOM from 'react-dom/client';
import UploadCommandWrapper from '../../components/wrapper/upload-command';

const uploadFolderCommand = (ctx: Forguncy.Plugin.CommandBase) => {
  const dom = document.createElement('div');
  ReactDOM.createRoot(dom).render(<UploadCommandWrapper ctx={ctx} />);
};

export default uploadFolderCommand;
