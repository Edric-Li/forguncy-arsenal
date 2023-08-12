import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { MdPreview, MdCatalog } from 'md-editor-rt';
import * as sanitizeHtml from 'sanitize-html';
import 'md-editor-rt/lib/preview.css';
import requestHelper from '../../../../common/request-helper';

const rootStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const mdPreviewStyle: CSSProperties = {
  height: '100%',
};

const MarkDownPreview = (props: IPreviewComponentProps) => {
  const [id] = useState(new Date().getTime().toString(36));
  const [text, setText] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const str = await requestHelper.getText(props.url);
      setText(sanitizeHtml(str));
    })();
  }, [props.url]);

  return (
    <div style={rootStyle} ref={rootRef}>
      <MdPreview editorId={id} modelValue={text} style={mdPreviewStyle} />
      <MdCatalog editorId={id} scrollElement={rootRef.current as HTMLElement} />
    </div>
  );
};

export default MarkDownPreview;
