import React, { CSSProperties, useEffect, useState } from 'react';
import requestHelper from '../../../../common/request-helper';

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
const SVGPreview = (props: IPreviewComponentProps) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    (async () => {
      setHtml(await requestHelper.getText(props.url));
    })();
  }, [props.url]);

  return <div style={style} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default SVGPreview;
