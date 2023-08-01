import { useEffect, useMemo, useRef } from 'react';
import preventDefaultEvent from '../../../../common/prevent-default-event';

const PDFViewer = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLIFrameElement>(null);
  const loaded = useRef(false);

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

  return <iframe ref={rootRef} height={'100%'} width={'100%'} frameBorder='0' src={src} />;
};

export default PDFViewer;
