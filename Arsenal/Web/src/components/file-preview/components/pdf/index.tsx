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
          'Resources/pdfjs-3.8.162/web/viewer.html?file=' +
          encodeURIComponent(url),
      );
    })();
  }, [props.url]);

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

      const setDomDisplay = (id: string, display: boolean) => {
        $(getIframeDocument()?.getElementById(id)!).css('display', display ? 'block' : 'none');
      };

      setDomDisplay('openFile', !props.pdfSettings?.hideOpenFileButton);
      setDomDisplay('print', !props.pdfSettings?.hidePrintButton);
      setDomDisplay('download', !props.pdfSettings?.hideSaveButton);
      setDomDisplay('editorModeButtons', !props.pdfSettings?.disableEdit);

      const isAllHide =
        props.pdfSettings?.hideOpenFileButton &&
        props.pdfSettings?.hidePrintButton &&
        props.pdfSettings?.hideSaveButton &&
        props.pdfSettings?.disableEdit;

      // 如果所有按钮都隐藏，则隐藏分隔线
      $('.verticalToolbarSeparator', getIframeDocument()).css('display', isAllHide ? 'none' : 'block');

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

    // @ts-ignore
    iframe.contentWindow.Arsenal = {
      preferences: {
        sidebarViewOnLoad: props.pdfSettings?.sidebarViewOnLoad,
        cursorToolOnLoad: props.pdfSettings?.cursorToolOnLoad,
        scrollModeOnLoad: props.pdfSettings?.scrollModeOnLoad,
        spreadModeOnLoad: props.pdfSettings?.spreadModeOnLoad,
      },
    } as any;

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
