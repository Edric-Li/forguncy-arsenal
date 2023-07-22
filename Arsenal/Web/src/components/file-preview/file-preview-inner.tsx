import React, { useEffect, useMemo, useRef } from 'react';
import IframeView from './components/iframe';
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
  { type: /mp4|webm|ogg|avi|wmv|mp3|aac|wav/, Component: IframeView },
  { type: /pdf/, Component: PDFViewer },
  { type: /jpg|jpeg|png|gif|bmp|webp/, Component: ImagePreview },
  { type: /svg/, Component: SVGPreview },
  { type: /xlsx|xls/, Component: ExcelPreview },
  { type: /doc|docx/, Component: DocxPreview },
];

export const isImage = (fileUrl: string) => {
  return /jpg|jpeg|png|gif|bmp|webp/.test(fileUrl.split('.').pop() || '');
};

const FilePreviewInner = (props: { url: string | null | undefined; options: IPreviewOptions }) => {
  const fileExtension = useMemo(() => props.url?.split('.').pop(), [props.url]) || '';
  const [exists, setExists] = React.useState<boolean | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRootRef = useRef<HTMLDivElement>(null);

  const watermarkSettings = useMemo(() => {
    if (props.options.watermarkSettings) {
      return convertPreviewWatermarkSettings(props.options.watermarkSettings);
    }
    return null;
  }, []);

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
  }, [size]);

  let Component: React.ComponentType<IPreviewComponentProps> | null =
    _.find(viewMap, (m) => m.type.test(fileExtension))?.Component ?? null;

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

      {props.options.enableWatermark && watermarkSettings && (
        <div ref={watermarkRootRef}>
          <Watermark className='arsenal-watermark' {...watermarkSettings} />
        </div>
      )}
    </div>
  );
};

export default FilePreviewInner;
