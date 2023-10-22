import FileModalPreview from '../../file-modal-preview';
import isInternalFile from '../../../common/is-internal-file';
import FileUploadEngine from '../../../common/file-upload-engine';
import { useEffect, useState } from 'react';

interface IParams {
  url: string;
  previewSetting: IPreviewOptions;
}

const PreviewFileCommandWrapper = (props: { ctx: Forguncy.Plugin.CommandBase; onDestroy: () => void }) => {
  const { ctx } = props;
  const params = ctx.CommandParam as IParams;
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState(params.url);
  const [url, setUrl] = useState(params.url);

  useEffect(() => {
    let _title = '';
    let _url = ctx.evaluateFormula(params.url) as string;

    if (isInternalFile(_url)) {
      _title = _url.substring(37);
      _url = FileUploadEngine.getAccessUrl(_url);
    } else {
      _title = _url.split('/').at(-1) ?? '';
    }

    setTitle(_title);
    setUrl(_url);
  }, []);

  if (!open || !url) {
    return null;
  }

  return (
    <FileModalPreview
      url={url}
      title={title}
      onCancel={() => {
        setOpen(false);
        props.onDestroy();
      }}
      evaluateFormula={ctx.evaluateFormula.bind(ctx)}
      previewSetting={params.previewSetting}
    />
  );
};

export default PreviewFileCommandWrapper;
