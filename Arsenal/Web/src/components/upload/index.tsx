import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import FileUpload from '../../common/file-upload';
import zhCN from 'antd/es/locale/zh_CN';
import { UploadListType } from 'antd/es/upload/interface';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, PointerSensor, useSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/css';
import ImgCrop from 'antd-img-crop';
import FilePreviewInner from '../file-preview/FilePreviewInner';
import Dialog from '../dialog';

enum ListType {
  text,
  picture,
  'picture-card',
  'picture-circle',
}

export interface CellTypeConfig {
  AllowedFileTypes: string;
  EnableResumableUpload: boolean;
  Folder: string;
  ListType: ListType;
  AllowMultipleSelection?: boolean;
  cellType: CellType;
  AllowFragAndDropOrder: boolean;
  EnableCrop: boolean;
}

interface IProps {
  cellType: CellType;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface DraggableUploadListItemProps {
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  file: UploadFile<any>;
}

const DraggableUploadListItem = ({ originNode, file }: DraggableUploadListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
    resizeObserverConfig: undefined,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    width: '100%',
    height: '100%',
  };

  // prevent preview event when drag end
  const className = isDragging
    ? css`
        a {
          pointer-events: none;
        }
      `
    : '';

  return (
    <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
      {/* hide error tooltip when dragging */}
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
};

const maxDialogWidth = ~~(document.body.clientWidth * 0.8);
const maxDialogHeight = ~~(document.body.clientHeight * 0.8);

const PCUpload = (props: IProps) => {
  const [config] = useState<CellTypeConfig>(props.cellType.CellElement.CellType as CellTypeConfig);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const fileUpload = useMemo(() => new FileUpload(config, props.cellType), []);
  const listType: UploadListType = useMemo(() => ListType[config.ListType] as UploadListType, [config]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>();

  useEffect(() => {
    props.cellType.setValueToElement = (jelement, value) => {
      if (!value) {
        return;
      }
      const files = value.split('|');

      fileListRef.current = files.map((i: string) => {
        return {
          uid: i,
          name: i.substring(37),
          status: 'done',
          percent: 0,
          url: FileUpload.getFileUrl(i),
        };
      });

      syncFileListRefDataToState();
    };

    // @ts-ignore
    props.cellType.getValueFromElement = () => {
      return fileListRef.current.map((file) => file.uid).join('|');
    };
  }, [fileList]);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = fileListRef.current.findIndex((i) => i.uid === active.id);
      const overIndex = fileListRef.current.findIndex((i) => i.uid === over?.id);

      // 如果超7,该次拖拽直接取消
      if (activeIndex === -1 || overIndex === -1) {
        return;
      }

      const tem = fileListRef.current[activeIndex];
      fileListRef.current[activeIndex] = fileListRef.current[overIndex];
      fileListRef.current[overIndex] = tem;

      syncFileListRefDataToState();
      props.cellType.commitValue();
    }
  };

  const syncFileListRefDataToState = () => setFileList([...fileListRef.current]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const uploadFile: UploadFile = {
      uid: file.uid,
      name: file.name,
      status: 'uploading',
      percent: 0,
    };

    fileListRef.current = [...fileListRef.current, uploadFile];

    syncFileListRefDataToState();

    await fileUpload.addTask(file, (callbackInfo) => {
      Object.assign(uploadFile, callbackInfo);
      if (uploadFile.status === 'success') {
        props.cellType.commitValue();
      }
      syncFileListRefDataToState();
    });
    return false;
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = fileListRef.current.findIndex((item) => item.uid === file.uid);
    fileListRef.current.splice(index, 1);
    syncFileListRefDataToState();
    props.cellType.commitValue();
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleDownload: UploadProps['onDownload'] = (file) => {
    fileUpload.download(file.uid);
  };

  const renderButton = useMemo(() => {
    if (listType === 'picture-circle' || listType === 'picture-card') {
      return (
        <>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传</div>
        </>
      );
    }

    return <Button icon={<UploadOutlined />}>上传</Button>;
  }, [listType]);

  const renderUpload = () => {
    return (
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        <SortableContext items={fileList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
          <Upload
            fileList={fileList}
            beforeUpload={handleBeforeUpload}
            listType={listType}
            onRemove={handleRemove}
            onPreview={handlePreview}
            multiple={config.AllowMultipleSelection}
            accept={config.AllowedFileTypes}
            onDownload={handleDownload}
            showUploadList={{
              showDownloadIcon: true,
              downloadIcon: <DownloadOutlined />,
              showRemoveIcon: true,
              showPreviewIcon: true,
              previewIcon: <EyeOutlined />,
              removeIcon: <DeleteOutlined />,
            }}
            itemRender={(originNode, file) => <DraggableUploadListItem originNode={originNode} file={file} />}
          >
            <div>{renderButton}</div>
          </Upload>
        </SortableContext>
      </DndContext>
    );
  };

  const renderContent = () => {
    if (config.EnableCrop) {
      return (
        <ImgCrop rotationSlider modalTitle='裁剪图片'>
          {renderUpload()}
        </ImgCrop>
      );
    }

    return renderUpload();
  };

  return (
    <ConfigProvider locale={zhCN}>
      {previewOpen && (
        <Dialog open title={previewTitle} footer={null} onCancel={handleCancel} centered width={maxDialogWidth}>
          <div style={{ width: '100%', height: maxDialogHeight }}>
            <FilePreviewInner url={previewImage} />
          </div>
        </Dialog>
      )}

      {renderContent()}
    </ConfigProvider>
  );
};

export default PCUpload;
