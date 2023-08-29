import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Spin } from 'antd';

import preventDefaultEvent from '../../../../common/prevent-default-event';
import FileUploadEngine from '../../../../common/file-upload-engine';

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
  const [isLoading, setIsLoading] = useState(true);

  const style = useMemo(() => {
    return {
      ...defaultStyle,
      backgroundColor: Forguncy.ConvertToCssColor(props.videoSettings.backgroundColor),
      opacity: 0,
    };
  }, [props]);

  useEffect(() => {
    const video = rootRef.current;

    if (!video) {
      return;
    }

    const handleResize = () => {
      if ((props.videoSettings.size as any) === VideoSize.Original) {
        $(video).css('width', video.videoWidth).css('height', video.videoHeight);
      } else {
        $(video).css('width', '100%').css('height', '100%');
      }
    };

    handleResize();

    video.addEventListener('loadedmetadata', function () {
      handleResize();
    });

    video.addEventListener('error', async () => {
      if (video.src === props.url && window.Arsenal.convertableFileExtensions?.has(props.suffix)) {
        video.src = FileUploadEngine.getConvertedFileUrl(props.url, 'mp4');
      }
    });

    video.addEventListener('canplay', async () => {
      video.style.opacity = '1';
      setIsLoading(false);
    });

    if (props.disableContextMenu) {
      video.addEventListener('contextmenu', preventDefaultEvent);
    }

    return () => {
      video.removeEventListener('contextmenu', preventDefaultEvent);
    };
  }, [rootRef, props.url]);

  return (
    <>
      <video
        ref={rootRef}
        title='preview'
        style={style}
        src={props.url}
        loop={props.videoSettings?.loop}
        muted={props.videoSettings?.muted}
        autoPlay={props.videoSettings?.autoPlay}
        controls={props.videoSettings?.controls}
        controlsList={props.videoSettings?.disableDownload ? 'nodownload' : undefined}
        disablePictureInPicture={props.videoSettings?.disablePictureInPicture}
        playsInline={props.videoSettings.playsInline}
      />
      {isLoading && (
        <div className='arsenal-spin-centered'>
          <Spin />
        </div>
      )}
    </>
  );
};

export default VideoViewer;
