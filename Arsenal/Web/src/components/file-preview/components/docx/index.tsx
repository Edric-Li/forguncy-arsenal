import React, { useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import requestHelper from '../../../../common/request-helper';

/**
 * Word预览组件
 * @param props
 * @constructor
 */
const DocxPreview = (props: IPreviewComponentProps) => {
  const rootRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    (async () => {
      const buffer = await requestHelper.getBlob(props.url);
      await renderAsync(buffer, rootRef.current as HTMLElement);
    })();
  }, [props.url]);

  return <div ref={rootRef} style={{ width: '100%', height: '100%', overflow: 'auto' }} />;
};

export default DocxPreview;
