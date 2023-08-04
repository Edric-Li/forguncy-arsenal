import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import convertFileToSrc from '../../common/convert-file-to-src';
import requestHelper from '../../common/request-helper';

interface IProps {
  url: string;
  onClose: () => void;
}

/**
 * 图片全屏预览组件
 * @param props
 * @constructor
 */
const ImageFullScreenPreview = (props: IProps) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    (async () => {
      const file = await requestHelper.getFile(props.url);
      const url = await convertFileToSrc(file);
      setSrc(url);
    })();
  }, []);

  return (
    <Image
      src=''
      style={{ display: 'none' }}
      preview={{
        visible: true,
        src: src,
        onVisibleChange: props.onClose,
      }}
    />
  );
};

export default ImageFullScreenPreview;
