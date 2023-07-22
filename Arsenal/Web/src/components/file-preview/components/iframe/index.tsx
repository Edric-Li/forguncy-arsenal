import { CSSProperties, useEffect, useRef } from 'react';
import preventDefaultEvent from '../../../../common/prevent-default-event';

const style: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

const IframeView = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = rootRef.current;

    if (!iframe) {
      return;
    }

    const getIframeDocument = () => iframe.contentDocument || iframe.contentWindow?.document;

    iframe.addEventListener('load', () => {
      if (!getIframeDocument()) {
        return;
      }

      if (props.disableContextMenu) {
        getIframeDocument()?.addEventListener('contextmenu', preventDefaultEvent);
      }
    });

    return () => {
      getIframeDocument()?.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef]);

  return (
    <iframe
      ref={rootRef}
      style={style}
      title='preview'
      name='printfFrame'
      frameBorder='0'
      src={props.url}
      allowFullScreen
    />
  );
};

export default IframeView;
