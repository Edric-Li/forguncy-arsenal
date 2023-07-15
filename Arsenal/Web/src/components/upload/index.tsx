import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { ShowUploadListInterface, UploadListType } from 'antd/es/upload/interface';
import FileUploadEngine from '../../common/file-upload-engine';
import ImgCrop from 'antd-img-crop';
import FilePreviewInner, {isImage} from '../file-preview/file-preview-inner';
import {getBase64} from '../../common/get-base64';
import ImageFullScreenPreview from '../image-full-screen-preview';
import CacheService from '../../common/cache-service';
import addWatermarkToFile from '../../common/add-watermark-to-file';
import {ConflictStrategy, ImgCropSettings, WatermarkSettings} from '../../declarations/types';
import useFileUploadEngine from '../../hooks/useFileUploadEngine';
import usePermission from '../../hooks/usePermission';
import cx from 'classnames';
import isImageUrl from '../../common/is-image-url';
import isInternalFile from '../../common/is-internal-file';

enum ListType {
  text,
  picture,
  'picture-card',
  'picture-circle',
}

enum Element {
  Upload,
  Delete,
  Preview,
  Download,
}

enum ElementState {
  Visible,
  Hidden,
}

export interface IOptions {
  listType: ListType;
  IsDisabled: boolean;
  ReadOnly: boolean;
  permissionSettings: {
    upload: string[];
    download: string[];
    preview: string[];
    delete: string[];
  };
  uploadSettings: {
    enableWatermark: boolean;
    watermarkSettings: WatermarkSettings;
    enableCrop: boolean;
    imgCropSettings: ImgCropSettings;
    enableResumableUpload: boolean;
    folder: string;
    conflictStrategy: ConflictStrategy;
    multiple: boolean;
    maxCount: number;
    maxSize: number;
    allowedExtensions: string;
  };
}

export interface IProps {
  container: JQuery;
  evaluateFormula: (value: string) => unknown;
  commitValue: () => void;
  options: IOptions;
}

const maxDialogWidth = ~~document.body.clientWidth;
const maxDialogHeight = ~~document.body.clientHeight - 105;

const PCUpload = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  const uploadContainerRef = useRef<HTMLDivElement | null>(null);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const listType: UploadListType = useMemo(() => ListType[props.options.listType] as UploadListType, [props]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(props.options.IsDisabled);

  const [messageApi, contextHolder] = message.useMessage();
  const [directory, setDirectory] = useState(false);
  const [showUploadList, setShowUploadList] = useState<ShowUploadListInterface>();
  const [showUploadButton, setShowUploadButton] = useState(false);

  const permission = usePermission();
  const hasUploadPermission = useMemo(() => permission.hasPermission(props.options.permissionSettings.upload), []);
  const hasDeletePermission = useMemo(() => permission.hasPermission(props.options.permissionSettings.delete), []);
  const hasPreviewPermission = useMemo(() => permission.hasPermission(props.options.permissionSettings.preview), []);
  const hasDownloadPermission = useMemo(() => permission.hasPermission(props.options.permissionSettings.download), []);
  const isUnClickableList = useMemo(
    () => disabled || (!hasDownloadPermission && !hasPreviewPermission && !hasDeletePermission),
    [hasDownloadPermission, hasPreviewPermission, hasDeletePermission, disabled],
  );

  useEffect(() => {
    const newUploadList = {
      showDownloadIcon: hasDownloadPermission,
      showPreviewIcon: hasPreviewPermission,
      showRemoveIcon: !props.options.ReadOnly && hasDeletePermission,
      downloadIcon: <DownloadOutlined />,
      previewIcon: <EyeOutlined />,
      removeIcon: <DeleteOutlined />,
    };

    setShowUploadButton(hasUploadPermission && !props.options.ReadOnly);
    setShowUploadList(newUploadList);
  }, []);

  useEffect(() => {
    if (!directory) {
      return;
    }
    uploadContainerRef.current?.click();
    setDirectory(false);
  }, [directory]);

  const fileUpload = useFileUploadEngine({
    enableResumableUpload: props.options.uploadSettings.enableResumableUpload,
    folder: props.options.uploadSettings.folder,
    conflictStrategy: props.options.uploadSettings.conflictStrategy,
    evaluateFormula: props.evaluateFormula,
  });

  useImperativeHandle(ref, () => {
    return {
      setValue: (value: string) => {
        if (!value) {
          return;
        }
        const files = value.split('|').filter((i) => i);

        fileListRef.current = files.map((i: string) => {
          return {
            uid: i,
            name: isInternalFile(i) ? i.substring(37) : i,
            status: 'done',
            percent: 0,
            url: FileUploadEngine.getAccessUrl(i),
          };
        });

        syncFileListRefDataToState();
      },

      getValue: () => {
        return fileListRef.current
          .filter((i) => i.status === 'done' || i.status === 'success')
          .map((file) => file.uid)
          .join('|');
      },

      setReadOnly(isReadOnly: boolean) {
        setShowUploadButton(!isReadOnly && hasUploadPermission);
      },

      setDisable(isDisabled: boolean) {
        setDisabled(isDisabled);
      },

      runtimeMethod: {
        upload(directory: boolean) {
          if (!directory) {
            uploadContainerRef.current?.click();
          } else {
            setDirectory(directory);
          }
        },

        setElementDisplayState(element: Element, elementState: ElementState) {
          if (element === Element.Upload && hasUploadPermission) {
            return setShowUploadButton(elementState === ElementState.Visible);
          }

          if (element === Element.Delete && hasDeletePermission) {
            return setShowUploadList({
              ...showUploadList,
              showRemoveIcon: elementState === ElementState.Visible,
            });
          }

          if (element === Element.Preview && hasPreviewPermission) {
            return setShowUploadList({
              ...showUploadList,
              showPreviewIcon: elementState === ElementState.Visible,
            });
          }

          if (element === Element.Download && hasDownloadPermission) {
            return setShowUploadList({
              ...showUploadList,
              showDownloadIcon: elementState === ElementState.Visible,
            });
          }
        },
      },
    };
  });

  const syncFileListRefDataToState = () => setFileList([...fileListRef.current]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (file.size / 1024 / 1024 > props.options.uploadSettings.maxSize) {
      messageApi.error({
        key: 'arsenal',
        type: 'error',
        content: `上传的文件 ${file.name} 的大小超出了限制, 最大上传文件的大小为 ${props.options.uploadSettings.maxSize} MB。`,
      });
      return false;
    }

    if (props.options.uploadSettings.maxCount) {
      if (fileListRef.current.length >= props.options.uploadSettings.maxCount) {
        messageApi.error({
          key: 'arsenal',
          type: 'error',
          content: `上传的文件数量超出了限制, 最大上传数量为 ${props.options.uploadSettings.maxCount}。`,
        });
        return false;
      }
    }

    const newFile =
      file.type.startsWith('image/') && props.options.uploadSettings.enableWatermark
        ? await addWatermarkToFile(file, props.options.uploadSettings.watermarkSettings)
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
    if (!hasDeletePermission || props.options.ReadOnly) {
      return false;
    }
    const index = fileListRef.current.findIndex((item) => item.uid === file.uid);
    fileListRef.current.splice(index, 1);
    syncFileListRefDataToState();
    props.commitValue();
  };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!hasPreviewPermission) {
      if (hasDownloadPermission) {
        FileUploadEngine.download(file.uid);
      }
      return;
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleDownload: UploadProps['onDownload'] = (file: UploadFile) => {
    if (showUploadList?.showDownloadIcon) {
      FileUploadEngine.download(file.uid);
    }
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
      <Button icon={<UploadOutlined />} disabled={disabled}>
        上传
      </Button>
    );
  }, [listType]);

  const renderUpload = () => {
    const {uploadSettings} = props.options;
    const multiple = uploadSettings.multiple && (!uploadSettings.maxCount || uploadSettings.maxCount > 0);
    return (
        <Upload
            isImageUrl={isImageUrl}
            directory={directory}
            fileList={fileList}
            listType={listType}
            onRemove={handleRemove}
        onDownload={handleDownload}
        beforeUpload={handleBeforeUpload}
        onPreview={handlePreview}
        multiple={multiple}
        accept={uploadSettings.allowedExtensions}
        maxCount={uploadSettings.maxCount}
        disabled={disabled}
        openFileDialogOnClick={!disabled && showUploadButton}
        showUploadList={showUploadList}
      >
        {<div ref={uploadContainerRef}>{showUploadButton && <div>{renderButton}</div>}</div>}
      </Upload>
    );
  };

  const renderContent = () => {
    if (props.options.uploadSettings.enableCrop) {
      const { centered, ...others } = props.options.uploadSettings.imgCropSettings;
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
      <Modal open title={previewTitle} footer={null} onCancel={handleCancel} centered width={maxDialogWidth}>
        <div style={{ width: '100%', height: maxDialogHeight }}>
          <FilePreviewInner url={previewImage} options={{ hideTabsWhenOnlyOneFile: true }} />
        </div>
      </Modal>
    );
  };

  return (
    <div className={cx('arsenal-upload-root', isUnClickableList && 'arsenal-upload-un-clickable-list')}>
      {contextHolder}
      {renderContent()}
      {renderFilePreview()}
    </div>
  );
});

export default PCUpload;
