import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import ImagePreview from './components/image';
import ExcelPreview from './components/excel';
import DocxPreview from './components/docx';
import _ from 'lodash';
import { isSuffixInLanguageMap } from './components/monaco-editor/utils';
import MonacoEditorView from './components/monaco-editor';
import SVGPreview from './components/svg';
import { Result, Watermark } from 'antd';
import FileUploadEngine from '../../common/file-upload-engine';
import convertPreviewWatermarkSettings from '../../common/convert-preview-watermark-settings';
import PDFViewer from './components/pdf';
import ResizeObserver from 'rc-resize-observer';
import preventDefaultEvent from '../../common/prevent-default-event';
import VideoViewer from './components/video';
import AudioViewer from './components/audio';
import { WatermarkProps } from 'antd/es/watermark';

const notSupportedStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
};

const viewMap: {
  type: RegExp;
  Component: React.ComponentType<IPreviewComponentProps>;
}[] = [
  { type: /mp3|wav|ogg|aac|flac|audio/, Component: AudioViewer },
  { type: /mp4|webm|video/, Component: VideoViewer },
  { type: /pdf|pptx|ppt|doc/, Component: PDFViewer },
  { type: /jpg|jpeg|png|gif|bmp|webp/, Component: ImagePreview },
  { type: /svg/, Component: SVGPreview },
  { type: /xlsx|xls/, Component: ExcelPreview },
  { type: /docx/, Component: DocxPreview },
];

export const isImage = (fileUrl: string) => {
  return /jpg|jpeg|png|gif|bmp|webp/.test(fileUrl.split('.').pop() || '');
};

interface IProps {
  url: string | null | undefined;
  evaluateFormula: (value: string) => unknown;
  options: IPreviewOptions;
}

export interface IPreviewRef {
  refreshWatermarkSettings: () => void;
}

const FilePreviewInner = React.forwardRef<IPreviewRef, IProps>((props: IProps, ref) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const fileExtension = useMemo(() => props.url?.split('.').pop(), [props.url]) || '';
  const [exists, setExists] = React.useState<boolean | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    refreshWatermarkSettings() {
      setRefreshKey((key) => key + 1);
    },
  }));

  useEffect(() => {
    if (props.options.disableContextMenu && rootRef.current) {
      rootRef.current.addEventListener('contextmenu', preventDefaultEvent);
    }

    return () => {
      rootRef.current?.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef, props]);

  useEffect(() => {
    if (props.url) {
      FileUploadEngine.checkFileExists(props.url).then((exists) => {
        setExists(exists);
      });
    }
  }, [props.url]);

  useEffect(() => {
    if (!size) {
      return;
    }

    // 这块样式处理的稀烂，但是没办法，忘了定位的样式怎么写了.....
    const dom = $('.arsenal-watermark', watermarkRootRef.current);
    dom
      .css('width', size.width)
      .css('height', size.height)
      .css('top', dom.parent().parent().parent().parent().height() - size.height);
  }, [size, refreshKey]);

  const watermarkSettings: WatermarkProps | null = useMemo(() => {
    const content = props.evaluateFormula(props.options.watermarkSettings?.content || '')?.toString();
    if (props.options.watermarkSettings && content) {
      return convertPreviewWatermarkSettings({
        ...props.options.watermarkSettings,
        content: content.replace(/\r\n/g, '\n').split('\n'),
      });
    }
    return null;
  }, [refreshKey]);

  let Component: React.ComponentType<IPreviewComponentProps> | null =
    _.find(viewMap, (m) => m.type.test(fileExtension.toLowerCase()))?.Component ?? null;

  if (Component === null) {
    if (isSuffixInLanguageMap(fileExtension)) {
      Component = MonacoEditorView;
    }
  }

  if (!props.url) {
    return null;
  }

  if (!Component) {
    return <div style={notSupportedStyle}>暂不支持该文件类型</div>;
  }

  if (exists === false) {
    return (
      <div className='arsenal-filled-and-centered'>
        <Result status='404' title='404' subTitle='对不起，该文件无法预览。请联系管理员获取更多信息。' />
      </div>
    );
  }

  return (
    <div className='arsenal-filled-and-centered' ref={rootRef}>
      <ResizeObserver
        onResize={(size) => {
          setSize(size);
        }}
      >
        <Component url={props.url} suffix={fileExtension} {...props.options} />
      </ResizeObserver>

      {watermarkSettings && (
        <div ref={watermarkRootRef}>
          <Watermark className='arsenal-watermark' {...watermarkSettings} />
        </div>
      )}
    </div>
  );
});

export default FilePreviewInner;
