import preventDefaultEvent from '../../../../common/prevent-default-event';
import { CSSProperties, useEffect, useMemo, useRef } from 'react';

const defaultStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

enum VideoSize {
  Fill,
  Original,
}

const VideoViewer = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLVideoElement>(null);

  const style = useMemo(() => {
    return {
      ...defaultStyle,
      backgroundColor: Forguncy.ConvertToCssColor(props.videoSettings.backgroundColor),
    };
  }, [props]);

  useEffect(() => {
    const video = rootRef.current;

    if (!video) {
      return;
    }

    video.addEventListener('loadedmetadata', function () {
      if ((props.videoSettings.size as any) === VideoSize.Original) {
        $(video).css('width', video.videoWidth).css('height', video.videoHeight);
      } else {
        $(video).css('width', '100%').css('height', '100%');
      }
    });

    if (props.disableContextMenu) {
      video.addEventListener('contextmenu', preventDefaultEvent);
    }

    return () => {
      video.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef, props]);

  return (
    <video
      ref={rootRef}
      title='preview'
      style={style}
      src={props.url}
      muted={props.videoSettings?.muted}
      autoPlay={props.videoSettings?.autoPlay}
      controls={props.videoSettings?.controls}
      controlsList={props.videoSettings?.disableDownload ? 'nodownload' : undefined}
      disablePictureInPicture={props.videoSettings?.disablePictureInPicture}
    />
  );
};

export default VideoViewer;
