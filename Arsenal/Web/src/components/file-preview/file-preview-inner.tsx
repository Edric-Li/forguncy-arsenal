import React, { useEffect, useMemo, useRef } from 'react';
import ImagePreview from './components/image';
import ExcelPreview from './components/excel';
import DocxPreview from './components/docx';
import _ from 'lodash';
import { isSuffixInLanguageMap } from './components/monaco-editor/utils';
import MonacoEditorView from './components/monaco-editor';
import SVGPreview from './components/svg';
import { Result, Watermark } from 'antd';
import convertPreviewWatermarkSettings from '../../common/convert-preview-watermark-settings';
import PDFViewer from './components/pdf';
import ResizeObserver from 'rc-resize-observer';
import preventDefaultEvent from '../../common/prevent-default-event';
import VideoViewer from './components/video';
import AudioViewer from './components/audio';
import { WatermarkProps } from 'antd/es/watermark';
import ZipViewer from './components/zip';
import requestHelper from '../../common/request-helper';
import getExtname from '../../common/get-extname';

const notSupportedStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
};

const convertibleFileTypes = new Set(['doc', 'ppt', 'pptx', 'xls', 'csv']);

const viewMap: {
  type: RegExp;
  Component: React.ComponentType<IPreviewComponentProps>;
}[] = [
  { type: /mp3|wav|ogg|aac|flac|audio/, Component: AudioViewer },
  { type: /mp4|webm|video/, Component: VideoViewer },
  {
    type: /pdf|pptx|ppt|doc/,
    Component: PDFViewer,
  },
  {
    type: /dxf|dwg|dgn|dwf|dwfx|dxb|dwt|plt|cf2|obj|fbx|collada|stl|stp|ifc|iges|3ds/,
    Component: PDFViewer,
  },
  { type: /jpg|jpeg|png|gif|bmp|webp/, Component: ImagePreview },
  { type: /svg/, Component: SVGPreview },
  { type: /xlsx|xls|csv/, Component: ExcelPreview },
  { type: /docx/, Component: DocxPreview },
  { type: /zip|fgcc/, Component: ZipViewer },
];

export const isImage = (fileUrl: string) => {
  return /jpg|jpeg|png|gif|bmp|webp/.test(fileUrl.split('.').pop() || '');
};

interface IProps {
  url: string | null | undefined;
  evaluateFormula: (value: string) => unknown;
  options: IPreviewOptions;
}

const FilePreviewInner = (props: IProps) => {
  const fileExtension = useMemo(() => getExtname(props.url || '', false), [props.url]) || '';
  const [exists, setExists] = React.useState<boolean | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.options.disableContextMenu && rootRef.current) {
      rootRef.current.addEventListener('contextmenu', preventDefaultEvent);
    }

    return () => {
      rootRef.current?.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef, props]);

  useEffect(() => {
    (async () => {
      if (props.url) {
        if (!window.Arsenal.convertableFileExtensions) {
          const res = await requestHelper.getConvertableFileExtensions();
          window.Arsenal.convertableFileExtensions = new Set(res.data);
        }
        const exists = await requestHelper.checkFileExists(props.url);
        setExists(exists);
      }
    })();
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
  }, [size, props.options]);

  const watermarkSettings: WatermarkProps | null = useMemo(() => {
    const content = props.evaluateFormula(props.options.watermarkSettings?.content || '')?.toString();
    if (props.options.watermarkSettings && content) {
      return convertPreviewWatermarkSettings({
        ...props.options.watermarkSettings,
        content: content.replace(/\r\n/g, '\n').split('\n'),
      });
    }
    return null;
  }, [props.options]);

  let Component: React.ComponentType<IPreviewComponentProps> | null =
    _.find(viewMap, (m) => m.type.test(fileExtension.toLowerCase()))?.Component ?? null;

  if (Component === null) {
    if (isSuffixInLanguageMap(fileExtension)) {
      Component = MonacoEditorView;
    }
  }

  if (fileExtension === 'docx' && !window.Arsenal.convertableFileExtensions?.has('docx')) {
    Component = DocxPreview;
  }

  if (!props.url) {
    return null;
  }

  if (exists === null) {
    return null;
  }

  // 如果找不到对应的组件，或者是可转换的文件类型，但是不支持转换，就显示暂不支持
  if (
    !Component ||
    (convertibleFileTypes.has(fileExtension) && !window.Arsenal.convertableFileExtensions?.has(fileExtension))
  ) {
    return <div style={notSupportedStyle}>暂不支持该文件类型</div>;
  }

  if (!exists) {
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
        <Component url={props.url} suffix={fileExtension} evaluateFormula={props.evaluateFormula} {...props.options} />
      </ResizeObserver>

      {watermarkSettings && (
        <div ref={watermarkRootRef}>
          <Watermark className='arsenal-watermark' {...watermarkSettings} />
        </div>
      )}
    </div>
  );
};

export default FilePreviewInner;
