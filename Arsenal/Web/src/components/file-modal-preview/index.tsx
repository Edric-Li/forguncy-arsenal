import FilePreviewInner, { isImage } from '../file-preview/file-preview-inner';
import ImageFullScreenPreview from '../image-full-screen-preview';
import { Modal } from 'antd';

interface IProps {
  url: string;
  title: string;
  imageItems?: string[];
  onCancel: () => void;
  evaluateFormula: (value: string) => unknown;
  previewSetting: IPreviewOptions;
}

const FileModalPreview = (props: IProps) => {
  if (isImage(props.url)) {
    return <ImageFullScreenPreview url={props.url} onClose={props.onCancel} items={props.imageItems} />;
  }

  return (
    <Modal
      open
      title={props.title}
      footer={null}
      onCancel={props.onCancel}
      centered
      width={document.body.clientWidth}
      destroyOnClose
    >
      <div style={{ width: '100%', height: document.body.clientHeight - 105 }}>
        <FilePreviewInner url={props.url} evaluateFormula={props.evaluateFormula} options={props.previewSetting} />
      </div>
    </Modal>
  );
};

export default FileModalPreview;
