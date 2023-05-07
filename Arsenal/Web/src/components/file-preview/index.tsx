import ExcelPreview from './components/excel';
import ImagePreview from './components/image';
import IframeView from './components/iframe';
import React, {useEffect, useMemo, useState} from 'react';
import FileUpload from '../../common/file-upload';
import PdfPreview from './components/pdf';
import _ from 'lodash';
import DocxPreview from './components/docx';
import MonacoEditorView from './components/monaco-editor';

const viewMap = [
    { type: /video|audio|link/, Component: IframeView },
    { type: /jpeg|jpg|png|gif|bmp]/, Component: ImagePreview },
    { type: /xlsx|csv|xls/, Component: ExcelPreview },
    { type: /pdf/, Component: PdfPreview },
    { type: /docx/, Component: DocxPreview },
];

const FilePreview = (props:IProps) => {
    const [url, setUrl] = useState<string | null>(null);

    const setValidUrl = (url: string) => {
        if (!url) {
            return;
        }
        // 如果不是http开头的，认为是活字格的内置的文件
        if (!url.startsWith('http')) {
            url = FileUpload.getFileUrl(url.split('|').pop() ?? '');
        }
        setUrl(url);
    };

    useEffect(() => {
        props.cellType.setValueToElement = (jelement, value) => {
            setValidUrl(value);
        };

        setValidUrl(props.cellType.getValueFromDataModel());
    }, []);

    const fileExtension = useMemo(()=>url?.split('.').pop(),[url]) || '';

    const Component = _.find(viewMap, m => m.type.test(fileExtension))?.Component || MonacoEditorView;

    if(!url){
        return null;
    }
    return <Component url={url} cellType={props.cellType} />;

};

export default FilePreview;
