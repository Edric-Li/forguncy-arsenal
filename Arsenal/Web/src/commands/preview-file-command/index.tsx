import React from 'react';
import ReactDOM from 'react-dom/client';
import PreviewFileCommandWrapper from '../../components/wrapper/preview-file-command';

const previewFileCommand = (ctx: Forguncy.Plugin.CommandBase) => {
  const dom = document.createElement('div');

  ReactDOM.createRoot(dom).render(
    <PreviewFileCommandWrapper
      ctx={ctx}
      onDestroy={() => {
        dom.remove();
      }}
    ></PreviewFileCommandWrapper>,
  );
};

export default previewFileCommand;
