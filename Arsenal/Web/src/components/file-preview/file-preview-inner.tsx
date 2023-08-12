import React, { useEffect, useMemo, useRef } from 'react';
import ImagePreview from './components/image';
import ExcelPreview from './components/excel';
import WordPreview from './components/word';
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
import PowerPointPreview from './components/ppt';
import NotSupport from './not-support';
import MarkDownPreview from './components/md';
import HtmlPreview from './components/html';

const convertibleFileTypes = new Set(['doc', 'ppt', 'xls', 'csv']);

const viewMap: {
  type: RegExp;
  Component: React.ComponentType<IPreviewComponentProps>;
}[] = [
  { type: /mp3|wav|ogg|aac|flac|audio/, Component: AudioViewer },
  {
    type: /mp4|video|avi|wmv|mov|flv|mkv|rmvb|rm|3gp|mpeg|mpg|vob|swf|asf|m4v|f4v|dat|mts|m2ts|mxf|m2v|3g2|3gp2|3gpp|3gpp2|dv|divx|xvid|264|h264|h265|hevc|vp8|vp9|webm|ogv|ogg|dvd/,
    Component: VideoViewer,
  },
  { type: /doc|docx/, Component: WordPreview },
  { type: /ppt|pptx/, Component: PowerPointPreview },
  { type: /pdf/, Component: PDFViewer },
  {
    type: /dxf|dwg|dgn|dwf|dwfx|dxb|dwt|plt|cf2|obj|fbx|collada|stl|stp|ifc|iges|3ds/,
    Component: PDFViewer,
  },
  { type: /jpg|jpeg|png|gif|bmp|webp/, Component: ImagePreview },
  { type: /svg/, Component: SVGPreview },
  { type: /xlsx|xls|csv/, Component: ExcelPreview },
  { type: /zip|fgcc|fgcp/, Component: ZipViewer },
  { type: /md/, Component: MarkDownPreview },
  { type: /htm|html/, Component: HtmlPreview },
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
    return <NotSupport />;
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
