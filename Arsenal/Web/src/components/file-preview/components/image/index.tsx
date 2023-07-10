import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Image as AntdImage } from 'antd';
import getImageSize from '../../../../common/get-image-size';
import adjustImageSize from '../../../../common/adjust-image-size';

const style: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

/**
 * 图片预览组件
 * @param props
 * @constructor
 */
const ImagePreview = (props: IPreviewComponentProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    (async () => {
      const containerWidth = ref.current!.offsetWidth;
      const containerHeight = ref.current!.offsetHeight;
      let [imageWidth, imageHeight] = await getImageSize(props.url);

      if (imageWidth > containerWidth && imageHeight > containerHeight) {
        const size = adjustImageSize(imageWidth, imageHeight, containerWidth, containerHeight);
        imageWidth = size.width;
        imageHeight = size.height;
      }

      setImageSize({
        width: imageWidth,
        height: imageHeight,
      });
    })();
  }, [props]);

  return (
    <div style={style} ref={ref}>
      <AntdImage alt='' src={props.url} width={imageSize.width} height={imageSize.height} />
    </div>
  );
};

export default ImagePreview;
