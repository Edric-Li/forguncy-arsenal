import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import FileUpload from '../../common/file-upload';
import zhCN from 'antd/es/locale/zh_CN';
import { UploadListType } from 'antd/es/upload/interface';

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
}

interface IProps {
  cellType: CellType;
}

const PCUpload = (props: IProps) => {
  const [config] = useState<CellTypeConfig>(props.cellType.CellElement.CellType as CellTypeConfig);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileListRef = useRef<UploadFile[]>([]);
  const fileUpload = useMemo(() => new FileUpload(config, props.cellType), []);
  const listType: UploadListType = useMemo(() => ListType[config.ListType] as UploadListType, [config]);

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
          url: fileUpload.getFileUrl(i),
        };
      });

      syncFileListRefDataToState();
    };

    // @ts-ignore
    props.cellType.getValueFromElement = () => {
      return fileListRef.current.map((file) => file.uid).join('|');
    };
  }, [fileList]);

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

  return (
    <ConfigProvider locale={zhCN}>
      <Upload
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        listType={listType}
        onRemove={handleRemove}
        multiple={config.AllowMultipleSelection}
        accept={config.AllowedFileTypes}>
        <div>{renderButton}</div>
      </Upload>
    </ConfigProvider>
  );
};

export default PCUpload;
