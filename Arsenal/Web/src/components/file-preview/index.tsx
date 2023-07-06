import React, { useEffect, useState } from 'react';
import FileUploadEngine from '../../common/file-upload-engine';
import FilePreviewInner from './FilePreviewInner';

const FilePreview = (props: IProps) => {
  const [url, setUrl] = useState<string | null>(null);

  const setValidUrl = (url: string) => {
    if (!url) {
      return;
    }
    // 如果不是http开头的，认为是活字格的内置的文件
    if (!url.startsWith('http')) {
      url = FileUploadEngine.getFileUrl(url.split('|').pop() ?? '');
    }
    setUrl(url);
  };

  useEffect(() => {
    props.cellType.setValueToElement = (jelement, value) => {
      setValidUrl(value);
    };

    setValidUrl(props.cellType.getValueFromDataModel());
  }, []);

  return <FilePreviewInner url={url} />;
};

export default FilePreview;
