import { useEffect, useMemo, useRef, useState } from 'react';
import preventDefaultEvent from '../../../../common/prevent-default-event';
import FileUploadEngine from '../../../../common/file-upload-engine';
import requestHelper from '../../../../common/request-helper';
import { Spin } from 'antd';
import getExtname from '../../../../common/get-extname';

const PDFViewer = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string>('');
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      let url = props.url;

      // 如果不是pdf文件，先转换为pdf
      if (getExtname(url) !== '.pdf') {
        const res = await requestHelper.createFileConversionTask(props.url, 'pdf');

        if (!res.result) {
          return;
        }

        url = FileUploadEngine.getConvertedFileUrl(props.url, 'pdf');
      }

      setSrc(
        Forguncy.Helper.SpecialPath.getPluginRootPath('8748d7dc-994d-45b8-80f9-f510cfcac6ac') +
          'Resources/dist/pdfjs-3.8.162/web/viewer.html?file=' +
          encodeURIComponent(url),
      );
    })();
  }, []);

  useEffect(() => {
    const iframe = rootRef.current;

    if (!iframe) {
      return;
    }

    const handleElements = () => {
      loaded.current = true;

      if (!getIframeDocument()) {
        return;
      }

      $(getIframeDocument()?.getElementById('print')!).css(
        'display',
        props.pdfSettings?.hidePrintButton ? 'none' : 'block',
      );

      $(getIframeDocument()?.getElementById('download')!).css(
        'display',
        props.pdfSettings?.hideSaveButton ? 'none' : 'block',
      );

      if (props.disableContextMenu) {
        getIframeDocument()?.addEventListener('contextmenu', preventDefaultEvent);
      }
    };

    const getIframeDocument = () => iframe.contentDocument || iframe.contentWindow?.document;

    if (loaded.current) {
      handleElements();
    } else {
      iframe.addEventListener('load', handleElements);
    }

    return () => {
      getIframeDocument()?.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef, props]);

  return (
    <>
      <iframe ref={rootRef} height={'100%'} width={'100%'} frameBorder='0' src={src} />
      {!src && (
        <div className='arsenal-spin-centered'>
          <Spin />
        </div>
      )}
    </>
  );
};

export default PDFViewer;
