import React, { forwardRef, useEffect, useRef, useState } from 'react';
import FileUploadEngine from '../../common/file-upload-engine';
import FilePreviewInner from './file-preview-inner';
import { Tabs, TabsProps } from 'antd';
import isInternalFile from '../../common/is-internal-file';

const rootStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const tabsStyle: React.CSSProperties = {
  height: '62px',
};

const previewStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'hidden',
};

const FilePreview = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  const [url, setUrl] = useState<string | null>(null);
  const [items, setItems] = useState<TabsProps['items']>([]);
  const filesMap = useRef<Map<string, string>>(new Map<string, string>());
  const options = props.cellType.CellElement.CellType as IPreviewOptions;

  useEffect(() => {
    props.cellType.setValueToElement = (jelement, value) => {
      if (typeof value !== 'string') {
        return;
      }

      const parts = value?.split('|');
      const tabItems = parts.map((item: string) => {
        let name;
        let url = item;
        const key = item?.toString();
        if (isInternalFile(item)) {
          name = item.substring(37);
          url = FileUploadEngine.getAccessUrl(item);
        } else {
          name = item.split('/').at(-1);
        }
        filesMap.current.set(key, url);

        return {
          key,
          label: name,
        };
      });
      setItems(tabItems);
      setUrl(filesMap.current.get(tabItems[0].key) ?? '');
    };
  }, []);

  const handleChange = (key: string) => {
    setUrl(filesMap.current.get(key) ?? '');
  };

  return (
    <div style={rootStyle}>
      {(!options.hideTabsWhenOnlyOneFile || items?.length !== 1) && (
        <div style={tabsStyle}>
          <Tabs items={items} onChange={handleChange} />
        </div>
      )}

      <div style={previewStyle}>
        <FilePreviewInner url={url} options={options} />
      </div>
    </div>
  );
});

export default FilePreview;
