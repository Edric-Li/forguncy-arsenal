import { useEffect, useMemo, useRef } from 'react';
import preventDefaultEvent from '../../../../common/prevent-default-event';

const PDFViewer = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLIFrameElement>(null);

  const src = useMemo(
    () =>
      Forguncy.Helper.SpecialPath.getPluginRootPath('8748d7dc-994d-45b8-80f9-f510cfcac6ac') +
      'Resources/dist/pdfjs-3.8.162/web/viewer.html?file=' +
      encodeURIComponent(props.url + '?ac=1'),
    [props.url],
  );

  useEffect(() => {
    const iframe = rootRef.current;

    if (!iframe) {
      return;
    }

    const getIframeDocument = () => iframe.contentDocument || iframe.contentWindow?.document;

    iframe.addEventListener('load', () => {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

      if (!getIframeDocument()) {
        return;
      }

      if (props.pdfSettings?.hidePrintButton) {
        getIframeDocument()?.getElementById('print')?.remove();
      }

      if (props.pdfSettings?.hideSaveButton) {
        getIframeDocument()?.getElementById('download')?.remove();
      }

      if (props.disableContextMenu) {
        getIframeDocument()?.addEventListener('contextmenu', preventDefaultEvent);
      }
    });

    return () => {
      getIframeDocument()?.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef]);

  return <iframe ref={rootRef} height={'100%'} width={'100%'} frameBorder='0' src={src} />;
};

export default PDFViewer;
