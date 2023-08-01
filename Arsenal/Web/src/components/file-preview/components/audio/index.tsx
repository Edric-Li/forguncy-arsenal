import { CSSProperties, useEffect, useRef } from 'react';
import preventDefaultEvent from '../../../../common/prevent-default-event';

const style: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const AudioViewer = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const video = rootRef.current;

    if (!video) {
      return;
    }

    if (props.disableContextMenu) {
      video.addEventListener('contextmenu', preventDefaultEvent);
    }

    return () => {
      video.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef, props]);

  return (
    <audio
      ref={rootRef}
      title='preview'
      style={style}
      src={props.url}
      muted={props.videoSettings?.muted}
      autoPlay={props.videoSettings?.autoPlay}
      controls={props.videoSettings?.controls}
      controlsList={props.videoSettings?.disableDownload ? 'nodownload' : undefined}
    />
  );
};

export default AudioViewer;
