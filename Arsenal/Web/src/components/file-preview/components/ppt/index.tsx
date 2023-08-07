import { useEffect, useMemo, useRef } from 'react';
import preventDefaultEvent from '../../../../common/prevent-default-event';

/**
 * ppt预览组件
 * @param props
 * @constructor
 */
const PowerPointPreview = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLIFrameElement>(null);
  const loaded = useRef(false);

  const src = useMemo(() => {
    return (
      Forguncy.Helper.SpecialPath.getPluginRootPath('8748d7dc-994d-45b8-80f9-f510cfcac6ac') +
      'Resources/PPTXjs/index.html?file=' +
      encodeURIComponent(props.url)
    );
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
      <iframe height={'100%'} width={'100%'} frameBorder='0' src={src} />
    </>
  );
};

export default PowerPointPreview;
