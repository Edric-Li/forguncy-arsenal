import requestHelper from '../../../../common/request-helper';
import { CSSProperties, useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

const rootStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'auto',
};

const HtmlPreview = (props: IPreviewComponentProps) => {
  const [html, setHtml] = useState('');
  useEffect(() => {
    (async () => {
      const str = await requestHelper.getText(props.url);
      setHtml(sanitizeHtml(str));
    })();
  }, [props.url]);

  return <div style={rootStyle} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default HtmlPreview;
