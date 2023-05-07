import React, {useEffect} from 'react';
import PDFObject from 'pdfobject';

/**
 * Pdf预览组件
 * @param props
 * @constructor
 */
const PdfPreview = (props:IPreviewComponentProps) => {
    useEffect(() => {
        PDFObject.embed(props.url, props.cellType.getContainer()[0]);
    }, []);
    return null;
};

export default PdfPreview;

