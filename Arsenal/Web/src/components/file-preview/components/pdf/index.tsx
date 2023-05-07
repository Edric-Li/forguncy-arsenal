import React, {useEffect, useRef} from 'react';
import PDFObject from 'pdfobject';

/**
 * Pdf预览组件
 * @param props
 * @constructor
 */
const PdfPreview = (props:IPreviewComponentProps) => {
    const rootRef: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        PDFObject.embed(props.url, rootRef.current);
    }, []);
    return <div ref={rootRef} style={{width: '100%', height: '100%', overflow: 'auto'}}/>;
};

export default PdfPreview;

