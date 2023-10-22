import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { message, Modal, Upload, Dropdown, Button } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { ShowUploadListInterface, UploadListType } from 'antd/es/upload/interface';
import FileUploadEngine from '../../common/file-upload-engine';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import FilePreviewInner, { isImage } from '../file-preview/file-preview-inner';
import { getBase64 } from '../../common/get-base64';
import ImageFullScreenPreview from '../image-full-screen-preview';
import FileCacheService from '../../common/file-cache-service';
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
import { MenuProps } from 'antd/es/menu';
import executeCommand from '../../common/execute-command';
import getExtname from '../../common/get-extname';
import parseDataTransferItemList from '../../common/parse-data-transfer-iten-list';
import parseAccept from '../../common/parse-accept';
import { FileHashCalculationEngine } from '../../common/file-hash-calculation-engine';

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
  eventSettings: {
    beforeUpload: Forguncy.Plugin.ICustomCommandObject;
    afterUpload: Forguncy.Plugin.ICustomCommandObject;
    beforeDelete: Forguncy.Plugin.ICustomCommandObject;
    beforeDownload: Forguncy.Plugin.ICustomCommandObject;
    beforePreview: Forguncy.Plugin.ICustomCommandObject;
  };
  previewSetting: IPreviewOptions;
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
    computeHash: boolean;
  };
}

export interface IProps {
  container: JQuery;
  evaluateFormula: (value: string) => unknown;
  commitValue: () => void;
  options: IOptions;
  runTimePageName: string;
}

const PCUpload = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
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

    props.container.addClass('arsenal-fgc-container');
  }, []);

  useEffect(() => {
    const newUploadList = {
      showDownloadIcon: hasDownloadPermission && !hiddenElements.has(Element.Download),
      showPreviewIcon: hasPreviewPermission && !hiddenElements.has(Element.Preview),
      showRemoveIcon: !isReadOnly && hasDeletePermission && !hiddenElements.has(Element.Delete),
      downloadIcon: <DownloadOutlined />,
      previewIcon: <EyeOutlined />,
      removeIcon: <DeleteOutlined />,
    };

    setShowUploadButton(hasUploadPermission && !isReadOnly && !hiddenElements.has(Element.Upload));
    setShowUploadList(newUploadList);
  }, [hiddenElements, isReadOnly]);

  useEffect(() => {
    if (props.options.listType === ListType['picture-card'] || props.options.listType === ListType['picture-circle']) {
      $('.ant-upload-select', props.container).css('display', showUploadButton ? 'inline-block' : 'none');
    }
  }, [showUploadButton]);

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
    if (disabled) {
      return;
    }
    const el = $('.ant-upload input', props.container);
    if (isDirectory) {
      el.attr('directory', 'directory').attr('webkitdirectory', 'webkitdirectory');
    } else {
      el.removeAttr('directory').removeAttr('webkitdirectory');
    }

    el.click();

    if (defaultIsFolder) {
      el.attr('directory', 'directory').attr('webkitdirectory', 'webkitdirectory');
    } else {
      el.removeAttr('directory').removeAttr('webkitdirectory');
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
          fileListRef.current = [];
          uploadedFilesRef.current = [];
          syncFileListRefDataToState();
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
          setHiddenElements((oldHiddenElements) => {
            const newHiddenElements = new Set(oldHiddenElements);
            const method = elementState === ElementState.Hidden ? 'add' : 'delete';
            newHiddenElements[method](element);
            return newHiddenElements;
          });
        },
      },
    };
  });

  const syncFileListRefDataToState = () => setFileList([...fileListRef.current]);

  const handleBeforeUpload = async (file: CustomFile | RcFile) => {
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

    let fileHash = '';

    if (props.options.eventSettings.beforeUpload) {
      if (props.options.uploadSettings.computeHash || props.options.uploadSettings.enableResumableUpload) {
        fileHash = await FileHashCalculationEngine.execute(file);
      }
      const initParams = {
        [props.options.eventSettings.beforeUpload.ParamProperties['name']]: file.name,
        [props.options.eventSettings.beforeUpload.ParamProperties['ext']]: getExtname(file.name),
        [props.options.eventSettings.beforeUpload.ParamProperties['size']]: file.size,
        [props.options.eventSettings.beforeUpload.ParamProperties['hash']]: fileHash,
      };

      const isNormalComplete = await executeCommand(
        props.options.eventSettings.beforeUpload,
        initParams,
        props.runTimePageName,
      );

      if (!isNormalComplete) {
        return false;
      }
    }
    const newFile =
      file.type.startsWith('image/') && props.options.uploadSettings.enableWatermark
        ? await addWatermarkToFile(file, props.options.uploadSettings.watermarkSettings)
        : file;

    const customFile: CustomFile = newFile as CustomFile;
    customFile.uid = file.uid;
    customFile.relativePath = file.webkitRelativePath;

    const uploadFile: UploadFile = {
      uid: file.uid,
      name: file.name,
      status: 'uploading',
      percent: 0,
    };

    fileListRef.current = [...fileListRef.current, uploadFile];

    syncFileListRefDataToState();

    await fileUpload.addTask(customFile, (callbackInfo) => {
      const index = fileListRef.current.findIndex((i) => i.uid === uploadFile.uid);

      const mergedInfo = {
        ...fileListRef.current[index],
        ...callbackInfo,
      };

      fileListRef.current[index] = mergedInfo;

      if (mergedInfo.status === 'success') {
        FileCacheService.tryPut(callbackInfo.url!, newFile);
        uploadedFilesRef.current.push(mergedInfo);
        // 必须要在这里设置为done，否则会导致上传完成后，下载按钮不可用（Antd.Design源码中是这样判断的）
        mergedInfo.status = 'done';

        if (uploadedFilesRef.current.length === fileListRef.current.length) {
          props.commitValue();
        }
        if (props.options.eventSettings.afterUpload) {
          executeCommand(
            props.options.eventSettings.afterUpload,
            {
              [props.options.eventSettings.afterUpload.ParamProperties['name']]: file.name,
              [props.options.eventSettings.afterUpload.ParamProperties['fileKey']]:
                FileUploadEngine.extractFileNameFromUrl(callbackInfo.url!),
              [props.options.eventSettings.afterUpload.ParamProperties['ext']]: getExtname(file.name),
              [props.options.eventSettings.afterUpload.ParamProperties['size']]: file.size,
              [props.options.eventSettings.beforeUpload.ParamProperties['hash']]: fileHash,
            },
            props.runTimePageName,
          );
        }
      }

      syncFileListRefDataToState();
    });

    return false;
  };

  const handleRemove: UploadProps['onRemove'] = async (file) => {
    if (!hasDeletePermission || isReadOnly) {
      return false;
    }

    if (props.options.eventSettings.beforeDelete) {
      const isNormalComplete = await executeCommand(
        props.options.eventSettings.beforeDelete,
        {
          [props.options.eventSettings.beforeDelete.ParamProperties['name']]: file.name,
          [props.options.eventSettings.beforeDelete.ParamProperties['fileKey']]:
            FileUploadEngine.extractFileNameFromUrl(file.url!),
        },
        props.runTimePageName,
      );

      if (!isNormalComplete) {
        return false;
      }
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
        FileUploadEngine.download(FileUploadEngine.extractFileNameFromUrl(file.url!));
      }
      return;
    }

    if (props.options.eventSettings.beforePreview) {
      const isNormalComplete = await executeCommand(
        props.options.eventSettings.beforePreview,
        {
          [props.options.eventSettings.beforePreview.ParamProperties['name']]: file.name,
          [props.options.eventSettings.beforePreview.ParamProperties['fileKey']]:
            FileUploadEngine.extractFileNameFromUrl(file.url!),
        },
        props.runTimePageName,
      );

      if (!isNormalComplete) {
        return;
      }
    }

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleDownload: UploadProps['onDownload'] = async (file: UploadFile) => {
    if (!showUploadList?.showDownloadIcon) {
      return;
    }

    if (props.options.eventSettings.beforeDownload) {
      const isNormalComplete = await executeCommand(
        props.options.eventSettings.beforeDownload,
        {
          [props.options.eventSettings.beforeDownload.ParamProperties['name']]: file.name,
          [props.options.eventSettings.beforeDownload.ParamProperties['fileKey']]:
            FileUploadEngine.extractFileNameFromUrl(file.url!),
        },
        props.runTimePageName,
      );

      if (!isNormalComplete) {
        return;
      }
    }
    FileUploadEngine.download(FileUploadEngine.extractFileNameFromUrl(file.url!));
  };

  const handleBeforeCrop: ImgCropProps['beforeCrop'] = (file, fileList) => {
    const isImageType = isImageFileType(file.type);

    if (!isImageType) {
      handleBeforeUpload(file);
      return false;
    }

    return true;
  };

  useEffect(() => {
    let isMouseOverContainer = false;

    const handlePasteFile = (event: ClipboardEvent) => {
      if (event.clipboardData) {
        parseDataTransferItemList(event.clipboardData.items, handleBeforeUpload);
      }
    };

    const handleDocumentPaste = (event: ClipboardEvent) => {
      // 如果当前光标在该容器上, 或者整个页面只有一个上传组件, 则处理粘贴事件
      // 之所以使用光标判断是因为Antd.Design的button会把paste事件吃掉
      if (
        isMouseOverContainer ||
        document.querySelectorAll('input[type="file"]:not(#forguncy_FileInput)').length === 1
      ) {
        handlePasteFile(event);
      }
    };

    const mouseoverHandler = () => (isMouseOverContainer = true);
    const mouseoutHandler = () => (isMouseOverContainer = false);

    const dragoverHandler = (e: DragEvent) => {
      props.container.addClass('arsenal-drag-over').addClass('arsenal-drag-transition');
      e.preventDefault();
    };
    const dragleaveHandler = () => {
      props.container.removeClass('arsenal-drag-over');
    };

    const dropHandler = (e: DragEvent) => {
      props.container.removeClass('arsenal-drag-over');

      if (e.dataTransfer) {
        parseDataTransferItemList(e.dataTransfer.items, handleBeforeUpload);
      }

      e.preventDefault();
    };

    const el = props.container[0];

    if (!props.options.uploadSettings.allowDragAndDrop) {
      el.addEventListener('mouseover', mouseoverHandler);
      el.addEventListener('mouseout', mouseoutHandler);
      el.addEventListener('dragover', dragoverHandler);
      el.addEventListener('dragleave', dragleaveHandler);
      el.addEventListener('drop', dropHandler);
    }
    document.addEventListener('paste', handleDocumentPaste);

    return () => {
      el.removeEventListener('mouseover', mouseoverHandler);
      el.removeEventListener('mouseout', mouseoutHandler);
      el.removeEventListener('dragover', dragoverHandler);
      el.removeEventListener('dragleave', dragleaveHandler);
      el.removeEventListener('drop', dropHandler);
      document.removeEventListener('paste', handleDocumentPaste);
    };
  }, []);

  const uploadProps = useMemo<UploadProps<any>>(() => {
    const { uploadSettings } = props.options;
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
      accept: parseAccept(uploadSettings.allowedExtensions),
      maxCount: uploadSettings.maxCount,
      disabled: disabled,
      openFileDialogOnClick: !disabled && showUploadButton,
      showUploadList: showUploadList,
    };
  }, [props, disabled, showUploadButton, showUploadList, fileList, listType]);

  const renderButton = useMemo(() => {
    if (listType === 'picture-circle' || listType === 'picture-card') {
      return (
        <>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传</div>
        </>
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
          }}>
          <UploadOutlined />
          上传
        </Dropdown.Button>
      );
    }

    return (
      <Button icon={<UploadOutlined />} disabled={disabled} onClick={() => handleUpload()}>
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
            }}>
            {!hasDragComponent && (
              <>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
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
            className='arsenal-filled-and-centered'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (listType === 'picture-circle' || listType === 'picture-card') {
                handleUpload(false);
              }
            }}>
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
      const items: string[] = [];
      fileListRef.current.forEach((item) => {
        if (item.url && isImage(item.url)) {
          items.push(item.url);
        }
      });

      return <ImageFullScreenPreview url={previewImage} onClose={handleCancel} items={items}/>;
    }

    return (
      <Modal
        open
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        centered
        width={document.body.clientWidth}
        destroyOnClose>
        <div style={{ width: '100%', height: document.body.clientHeight - 105 }}>
          <FilePreviewInner
            url={previewImage}
            evaluateFormula={props.evaluateFormula}
            options={props.options.previewSetting}
          />
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
