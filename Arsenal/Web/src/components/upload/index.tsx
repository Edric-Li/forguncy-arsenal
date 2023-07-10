import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import FileUploadEngine from '../../common/file-upload-engine';
import { UploadListType } from 'antd/es/upload/interface';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent, PointerSensor, useSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/css';
import ImgCrop from 'antd-img-crop';
import FilePreviewInner, { isImage } from '../file-preview/FilePreviewInner';
import Dialog from '../dialog';
import { getBase64 } from '../../common/get-base64';
import ImageFullScreenPreview from '../image-full-screen-preview';
import CacheService from '../../common/cache-service';
import addWatermarkToFile from '../../common/add-watermark-to-file';
import { ConflictStrategy, ImgCropSettings, WatermarkSettings } from '../../declarations/types';
import useFileUploadEngine from '../../hooks/useFileUploadEngine';

enum ListType {
  text,
  picture,
  'picture-card',
  'picture-circle',
}

type UploadButtonStatusType = 'none' | 'disabled' | 'hidden';

export interface IOptions {
  enableResumableUpload: boolean;
  folder: string;
  conflictStrategy: ConflictStrategy;
  listType: ListType;
  enableCrop: boolean;
  imgCropSettings: ImgCropSettings;
  Disabled: boolean;
  ReadOnly: boolean;
  enableWatermark: boolean;
  watermarkSettings: WatermarkSettings;
  uploadSettings: {
    multiple: boolean;
    maxCount: number;
    maxSize: number;
    allowedExtensions: string;
    buttonStatusWhenQuantityReachesMaximum: UploadButtonStatusType;
  };
}

export interface IProps {
  evaluateFormula: (value: string) => unknown;
  commitValue: () => void;
  options: IOptions;
}

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

const PCUpload = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const listType: UploadListType = useMemo(() => ListType[props.options.listType] as UploadListType, [props]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(props.options.Disabled);
  const [readOnly, setReadOnly] = useState<boolean>(props.options.ReadOnly);
  const uploadContainerRef = useRef<HTMLDivElement | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [directory, setDirectory] = useState(false);

  const quantityLimit = useMemo(() => fileList.length >= props.options.uploadSettings.maxCount, [fileList]);

  const buttonDisabled = useMemo(
    () => quantityLimit && props.options.uploadSettings.buttonStatusWhenQuantityReachesMaximum === 'disabled',
    [quantityLimit],
  );

  const buttonHidden = useMemo(
    () => quantityLimit && props.options.uploadSettings.buttonStatusWhenQuantityReachesMaximum === 'hidden',
    [quantityLimit],
  );

  useEffect(() => {
    if (buttonDisabled) {
      uploadContainerRef.current?.parentElement?.classList.add('ant-upload-disabled');
      uploadContainerRef.current?.parentElement?.parentElement?.classList.add('ant-upload-disabled');
    } else {
      uploadContainerRef.current?.parentElement?.classList.remove('ant-upload-disabled');
      uploadContainerRef.current?.parentElement?.parentElement?.classList.remove('ant-upload-disabled');
    }
  }, [buttonDisabled]);

  const fileUpload = useFileUploadEngine({
    enableResumableUpload: props.options.enableResumableUpload,
    folder: props.options.folder,
    conflictStrategy: props.options.conflictStrategy,
    evaluateFormula: props.evaluateFormula,
  });

  useImperativeHandle(ref, () => {
    return {
      setValue: (value: string) => {
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
            url: FileUploadEngine.getFileUrl(i),
          };
        });

        syncFileListRefDataToState();
      },

      getValue: () => {
        return fileListRef.current.map((file) => file.uid).join('|');
      },

      setReadOnly(isReadOnly: boolean) {
        setReadOnly(isReadOnly);
      },

      setDisable(isDisabled: boolean) {
        setDisabled(isDisabled);
      },

      upload(directory: boolean) {
        if (!directory) {
          uploadContainerRef.current?.click();
        } else {
          setDirectory(directory);
        }
      },
    };
  });

  useEffect(() => {
    if (!directory) {
      return;
    }
    uploadContainerRef.current?.click();
    setDirectory(false);
  }, [directory]);

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
      props.commitValue();
    }
  };

  const syncFileListRefDataToState = () => setFileList([...fileListRef.current]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (file.size / 1024 / 1024 > props.options.uploadSettings.maxSize) {
      messageApi.error({
        key: 'arsenal',
        type: 'error',
        content: `上传的文件 ${file.name} 的大小超出了限制, 最大上传文件的大小为 ${props.options.uploadSettings.maxSize} MB。`,
      });
      return;
    }

    if (props.options.uploadSettings.maxCount) {
      if (fileListRef.current.length >= props.options.uploadSettings.maxCount) {
        messageApi.error({
          key: 'arsenal',
          type: 'error',
          content: `上传的文件数量超出了限制, 最大上传数量为 ${props.options.uploadSettings.maxCount}。`,
        });
        return;
      }
    }

    const newFile =
      file.type.startsWith('image/') && props.options.enableWatermark
        ? await addWatermarkToFile(file, props.options.watermarkSettings)
        : file;

    const uploadFile: UploadFile = {
      uid: file.uid,
      name: newFile.name,
      status: 'uploading',
      percent: 0,
    };

    fileListRef.current = [...fileListRef.current, uploadFile];

    syncFileListRefDataToState();
    await fileUpload.addTask(newFile, (callbackInfo) => {
      const index = fileListRef.current.findIndex((i) => i.uid === uploadFile.uid);

      const mergedInfo = {
        ...fileListRef.current[index],
        ...callbackInfo,
      };

      fileListRef.current[index] = mergedInfo;

      if (mergedInfo.status === 'success') {
        props.commitValue();
        CacheService.set(callbackInfo.url!, newFile);
      }
      syncFileListRefDataToState();
    });

    return;
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = fileListRef.current.findIndex((item) => item.uid === file.uid);
    fileListRef.current.splice(index, 1);
    syncFileListRefDataToState();
    props.commitValue();
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
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      );
    }

    return (
      <Button icon={<UploadOutlined />} disabled={buttonDisabled}>
        上传
      </Button>
    );
  }, [listType, buttonDisabled, buttonHidden]);

  const renderUpload = () => {
    const { uploadSettings } = props.options;
    const multiple = uploadSettings.multiple && (!uploadSettings.maxCount || uploadSettings.maxCount > 0);
    return (
      <Upload
        directory={directory}
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        listType={listType}
        onRemove={handleRemove}
        onPreview={handlePreview}
        multiple={multiple}
        accept={uploadSettings.allowedExtensions}
        maxCount={uploadSettings.maxCount}
        onDownload={handleDownload}
        disabled={disabled}
        openFileDialogOnClick={!disabled && !buttonDisabled && !buttonHidden}
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
        {!buttonHidden && <div ref={uploadContainerRef}>{!readOnly && <div>{renderButton}</div>}</div>}
      </Upload>
    );
  };

  const renderContent = () => {
    if (props.options.enableCrop) {
      const { centered, ...others } = props.options.imgCropSettings;
      return (
        <ImgCrop {...others} modalProps={{ centered }}>
          {renderUpload()}
        </ImgCrop>
      );
    }

    return renderUpload();
  };

  const renderFilePreview = () => {
    if (!previewOpen) {
      return null;
    }

    if (isImage(previewImage)) {
      return <ImageFullScreenPreview url={previewImage} onClose={handleCancel} />;
    }

    return (
      <Dialog open title={previewTitle} footer={null} onCancel={handleCancel} centered width={maxDialogWidth}>
        <div style={{ width: '100%', height: maxDialogHeight }}>
          <FilePreviewInner url={previewImage} />
        </div>
      </Dialog>
    );
  };

  return (
    <>
      {contextHolder}
      <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
        <SortableContext items={fileList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
          {renderContent()}
        </SortableContext>
      </DndContext>
      {renderFilePreview()}
    </>
  );
});

export default PCUpload;
