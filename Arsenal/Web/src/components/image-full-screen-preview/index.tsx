import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import convertFileToSrc from '../../common/convert-file-to-src';
import requestHelper from '../../common/request-helper';

interface IProps {
  url: string;
  onClose: () => void;
  items?: string[];
}

/**
 * 图片全屏预览组件
 * @param props
 * @constructor
 */
const ImageFullScreenPreview = (props: IProps) => {
  const [src, setSrc] = useState('');
  const [index, setIndex] = useState(0);

  const handleChange = async (index: number) => {
    const file = await requestHelper.getFile(props.items![index]);
    const url = await convertFileToSrc(file);
    setSrc(url);
    setIndex(index);
  };

  const countRender = (current: number, total: number): string => {
    return props?.items?.length ? `${current} / ${total}` : '';
  };

  useEffect(() => {
    if (!props.items?.length) {
      setSrc(props.url);
      return;
    }
    const index = props.items.findIndex((item) => item === props.url);
    handleChange(index).finally();
  }, []);

  return (
    <Image.PreviewGroup
      preview={{
        current: index,
        visible: true,
        src: src,
        onVisibleChange: props.onClose,
        onChange: handleChange,
        countRender,
      }}
      items={props.items}
    />
  );
};

export default ImageFullScreenPreview;
