import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {message, Modal, Upload, Dropdown, Button} from 'antd';
import type {RcFile, UploadProps} from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { ShowUploadListInterface, UploadListType } from 'antd/es/upload/interface';
import FileUploadEngine from '../../common/file-upload-engine';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import FilePreviewInner, { isImage } from '../file-preview/file-preview-inner';
import { getBase64 } from '../../common/get-base64';
import ImageFullScreenPreview from '../image-full-screen-preview';
import CacheService from '../../common/cache-service';
import addWatermarkToFile from '../../common/add-watermark-to-file';
import { ConflictStrategy, ImgCropSettings, WatermarkSettings } from '../../declarations/types';
import useFileUploadEngine from '../../hooks/useFileUploadEngine';
import usePermission from '../../hooks/usePermission';
import cx from 'classnames';
import isImageUrl from '../../common/is-image-url';
import isInternalFile from '../../common/is-internal-file';
import isImageFileType from '../../common/is-image-file-type';
import Dragger from 'antd/es/upload/Dragger';
import createUserControlPageInContainer from '../../common/create-user-control-page-in-container';
import {MenuProps} from 'antd/es/menu';

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

enum FileSelectionType {
  File,
  Folder,
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
    allowDragAndDrop: boolean;
    dragAndDropSettings: {
      dragUserControlPage: string;
      height: number;
    };
    allowFolderSelection: boolean;
    defaultSelectionOfFileType: FileSelectionType;
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
  const dragContainerRef = useRef<HTMLDivElement | null>(null);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const uploadedFilesRef = useRef<UploadFile[]>([]);
  const listType: UploadListType = useMemo(() => ListType[props.options.listType] as UploadListType, [props]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(props.options.IsDisabled);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(props.options.ReadOnly);
  const [hiddenElements, setHiddenElements] = useState<Set<Element>>(new Set());
  const [dropdownItemItems, setDropdownItemItems] = useState<MenuProps['items']>([]);

  const [messageApi, contextHolder] = message.useMessage();
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

  const defaultIsFolder = useMemo(() => {
    return (
        props.options.uploadSettings.defaultSelectionOfFileType === FileSelectionType.Folder &&
        (listType === 'text' || listType === 'picture')
    );
  }, []);

  useEffect(() => {
    if (props.options.uploadSettings.allowDragAndDrop && dragContainerRef.current) {
      const rootEl = $(dragContainerRef.current).parent().parent().parent();

      rootEl.children('.ant-upload-btn').css('padding', 0);
      rootEl.css('height', props.options.uploadSettings.dragAndDropSettings.height + 'px').css('overflow', 'auto');

      $(dragContainerRef.current).css('height', '100%').css('opacity', 1);
    }

    if (props.options.uploadSettings.dragAndDropSettings.dragUserControlPage && dragContainerRef.current) {
      createUserControlPageInContainer(
          dragContainerRef.current,
          props.options.uploadSettings.dragAndDropSettings.dragUserControlPage,
      );
    }

    const dropdownItemLabel = defaultIsFolder ? '上传文件' : '上传文件夹';

    setDropdownItemItems([
      {
        key: 'upload-extend',
        label: dropdownItemLabel,
      },
    ]);
  }, []);

  useEffect(() => {
    const newUploadList = {
      showDownloadIcon: hasDownloadPermission || !hiddenElements.has(Element.Download),
      showPreviewIcon: hasPreviewPermission || !hiddenElements.has(Element.Preview),
      showRemoveIcon: (!props.options.ReadOnly && hasDeletePermission) || !hiddenElements.has(Element.Delete),
      downloadIcon: <DownloadOutlined/>,
      previewIcon: <EyeOutlined/>,
      removeIcon: <DeleteOutlined/>,
    };

    setShowUploadButton(hasUploadPermission && !props.options.ReadOnly && !hiddenElements.has(Element.Upload));
    setShowUploadList(newUploadList);
  }, [hiddenElements, isReadOnly]);

  const hasDragComponent = useMemo(
      () => !!props.options.uploadSettings.dragAndDropSettings.dragUserControlPage,
      [props.options],
  );

  const fileUpload = useFileUploadEngine({
    enableResumableUpload: props.options.uploadSettings.enableResumableUpload,
    folder: props.options.uploadSettings.folder,
    conflictStrategy: props.options.uploadSettings.conflictStrategy,
    evaluateFormula: props.evaluateFormula,
  });

  const handleUpload = (isDirectory: boolean = defaultIsFolder) => {
    if (isDirectory) {
      $('.ant-upload input').attr('directory', 'directory').attr('webkitdirectory', 'webkitdirectory');
    } else {
      $('.ant-upload input').removeAttr('directory').removeAttr('webkitdirectory');
    }

    $('.ant-upload').children('input').click();

    if (defaultIsFolder) {
      $('.ant-upload input').attr('directory', 'directory').attr('webkitdirectory', 'webkitdirectory');
    } else {
      $('.ant-upload input').removeAttr('directory').removeAttr('webkitdirectory');
    }
  };

  useImperativeHandle(ref, () => {
    const getValue = () => {
      return fileListRef.current
          .filter((i) => (i.status === 'done' || i.status === 'success') && i.url?.length)
          .map((file) => FileUploadEngine.extractFileNameFromUrl(file.url!))
          .join('|');
    };

    return {
      setValue: (value: string) => {
        if (!value) {
          return;
        }
        const files = value.split('|').filter((i) => i);

        if (value === getValue()) {
          // 如果两次值相同，不做处理，否则动画会闪烁
          return;
        }

        fileListRef.current = files.map((i: string) => {
          return {
            uid: i,
            name: isInternalFile(i) ? i.substring(37) : i,
            status: 'done',
            percent: 100,
            url: FileUploadEngine.getAccessUrl(i),
          };
        });

        uploadedFilesRef.current = fileListRef.current;

        syncFileListRefDataToState();
      },

      getValue,

      setReadOnly(isReadOnly: boolean) {
        setIsReadOnly(isReadOnly);
      },

      setDisable(isDisabled: boolean) {
        setDisabled(isDisabled);
      },

      runtimeMethod: {
        upload() {
          handleUpload(false);
        },

        uploadFolder() {
          handleUpload(true);
        },

        setElementDisplayState(element: Element, elementState: ElementState) {
          const newHiddenElements = new Set(hiddenElements);
          const method = elementState === ElementState.Hidden ? 'add' : 'delete';
          newHiddenElements[method](element);
          setHiddenElements(newHiddenElements);
        },
      },
    };
  });

  const syncFileListRefDataToState = () => setFileList([...fileListRef.current]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (file.size / 1024 / 1024 > props.options.uploadSettings.maxSize) {
      messageApi.error({
        key: 'arsenal-size',
        type: 'error',
        content: `上传的文件 ${file.name} 的大小超出了限制, 最大上传文件的大小为 ${props.options.uploadSettings.maxSize} MB。`,
      });
      return false;
    }

    if (props.options.uploadSettings.maxCount) {
      if (fileListRef.current.length >= props.options.uploadSettings.maxCount) {
        messageApi.error({
          key: 'arsenal-count',
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
        CacheService.set(callbackInfo.url!, newFile);
        uploadedFilesRef.current.push(mergedInfo);

        if (uploadedFilesRef.current.length === fileListRef.current.length) {
          props.commitValue();
        }
      }

      syncFileListRefDataToState();
    });

    return false;
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

  const handleBeforeCrop: ImgCropProps['beforeCrop'] = (file, fileList) => {
    const isImageType = isImageFileType(file.type);

    if (!isImageType) {
      handleBeforeUpload(file, fileList);
      return false;
    }

    return true;
  };

  const uploadProps = useMemo<UploadProps<any>>(() => {
    const {uploadSettings} = props.options;
    const multiple = uploadSettings.multiple && (!uploadSettings.maxCount || uploadSettings.maxCount > 1);

    return {
      isImageUrl: isImageUrl,
      directory: true,
      fileList: fileList,
      listType: listType,
      onRemove: handleRemove,
      onDownload: handleDownload,
      beforeUpload: handleBeforeUpload,
      onPreview: handlePreview,
      multiple: multiple,
      accept: uploadSettings.allowedExtensions,
      maxCount: uploadSettings.maxCount,
      disabled: disabled,
      openFileDialogOnClick: !disabled && showUploadButton,
      showUploadList: showUploadList,
    };
  }, [props, disabled, showUploadButton, showUploadList, fileList, listType]);

  const renderButton = useMemo(() => {
    if (listType === 'picture-circle' || listType === 'picture-card') {
      return (
          <div
              onClick={() => {
                handleUpload(false);
              }}
          >
            <PlusOutlined/>
            <div style={{marginTop: 8}}>上传</div>
          </div>
      );
    }

    if (props.options.uploadSettings.allowFolderSelection) {
      return (
          <Dropdown.Button
              menu={{
                items: dropdownItemItems,
                onClick: (e) => {
                  handleUpload(!defaultIsFolder);
                },
              }}
              disabled={disabled}
              onClick={() => {
                handleUpload();
              }}
          >
            <UploadOutlined/>
            上传
          </Dropdown.Button>
      );
    }

    return (
        <Button icon={<UploadOutlined/>} disabled={disabled}>
          上传
        </Button>
    );
  }, [listType, dropdownItemItems]);

  const renderUpload = () => {
    if (props.options.uploadSettings.allowDragAndDrop) {
      return (
          <Dragger {...uploadProps}>
            <div
                ref={dragContainerRef}
                className='arsenal-drag-container'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpload();
                }}
            >
              {!hasDragComponent && (
                  <>
                    <p className='ant-upload-drag-icon'>
                      <InboxOutlined/>
                    </p>
                    <p className='ant-upload-text'>点击或拖动文件至此区域上传</p>
                    <p className='ant-upload-hint'>支持单个或批量上传。</p>
                  </>
              )}
            </div>
        </Dragger>
      );
    }

    return (
        <Upload {...uploadProps}>
          {
            <div
                ref={uploadContainerRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
            >
              {showUploadButton && <div>{renderButton}</div>}
            </div>
          }
        </Upload>
    );
  };

  const renderContent = () => {
    if (props.options.uploadSettings.enableCrop && !props.options.uploadSettings.multiple) {
      const { centered, ...others } = props.options.uploadSettings.imgCropSettings;
      return (
        <ImgCrop {...others} modalProps={{ centered }} beforeCrop={handleBeforeCrop}>
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
