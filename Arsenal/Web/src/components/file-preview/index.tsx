import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import FileUploadEngine from '../../common/file-upload-engine';
import FilePreviewInner from './file-preview-inner';
import { Tabs, TabsProps } from 'antd';
import isInternalFile from '../../common/is-internal-file';
import { clone } from 'lodash';

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
  const [options, setOptions] = useState(props.cellType.CellElement.CellType as IPreviewOptions);

  useImperativeHandle(ref, () => ({
    setValue(value: any) {
      if (typeof value !== 'string') {
        return;
      }

      const parts = value?.split('|').filter((i) => i.length);
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
    },
    onDependenceCellValueChanged() {
      options.watermarkSettings.content = (
        props.cellType.CellElement.CellType as IPreviewOptions
      ).watermarkSettings.content;
      setOptions(clone(options));
    },
    runtimeMethod: {
      updatePdfSetting(hideSaveButton: boolean | null, hidePrintButton: boolean) {
        if (hideSaveButton !== null) {
          options.pdfSettings.hideSaveButton = hideSaveButton;
        }

        if (hidePrintButton !== null) {
          options.pdfSettings.hidePrintButton = hidePrintButton;
        }

        setOptions(clone(options));
      },
      updateVideoSetting(
        autoPlay: boolean | null,
        controls: boolean | null,
        disableDownload: boolean | null,
        disablePictureInPicture: boolean | null,
        loop: boolean | null,
        muted: boolean | null,
        size: IVideoSize,
      ) {
        if (autoPlay !== null) {
          options.videoSettings.autoPlay = autoPlay;
        }

        if (controls !== null) {
          options.videoSettings.controls = controls;
        }

        if (disableDownload !== null) {
          options.videoSettings.disableDownload = disableDownload;
        }

        if (disablePictureInPicture !== null) {
          options.videoSettings.disablePictureInPicture = disablePictureInPicture;
        }

        if (loop !== null) {
          options.videoSettings.loop = loop;
        }

        if (muted !== null) {
          options.videoSettings.muted = muted;
        }

        options.videoSettings.size = size;

        setOptions(clone(options));
      },

      updateAudioSetting(
        autoPlay: boolean | null,
        controls: boolean | null,
        disableDownload: boolean | null,
        loop: boolean | null,
      ) {
        if (autoPlay !== null) {
          options.audioSettings.autoPlay = autoPlay;
        }

        if (controls !== null) {
          options.audioSettings.controls = controls;
        }

        if (disableDownload !== null) {
          options.audioSettings.disableDownload = disableDownload;
        }

        if (loop !== null) {
          options.audioSettings.loop = loop;
        }

        setOptions(clone(options));
      },

      updateContextMenuSetting(status: ContextMenuStatus) {
        options.disableContextMenu = status === ContextMenuStatus.Disable;
        setOptions(clone(options));
      },
    },
  }));

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
        <FilePreviewInner
          url={url}
          options={options}
          evaluateFormula={props.cellType.evaluateFormula.bind(props.cellType)}
        />
      </div>
    </div>
  );
});

export default FilePreview;
