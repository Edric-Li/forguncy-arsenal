import ExcelPreview from './components/excel';
import ImagePreview from './components/image';
import IframeView from './components/iframe';
import React, {useEffect, useMemo, useState} from 'react';
import FileUpload from '../../common/file-upload';
import PdfPreview from './components/pdf';
import _ from 'lodash';
import DocxPreview from './components/docx';
import MonacoEditorView from './components/monaco-editor';
import {isSuffixInLanguageMap} from './components/monaco-editor/utils';
// @ts-ignore
import s from './index.module.css';

const viewMap:{
    type: RegExp;
    Component: React.ComponentType<IPreviewComponentProps>;
}[] = [
    { type: /"mp4|webm|ogg|avi|wmv|mp3|aac|wav/, Component: IframeView },
    { type: /jpg|jpeg|png|gif|bmp|webp/, Component: ImagePreview },
    { type: /xlsx|xls/, Component: ExcelPreview },
    { type: /pdf/, Component: PdfPreview },
    { type: /doc|docx/, Component: DocxPreview },
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

    const fileExtension = useMemo(() => url?.split('.').pop(), [url]) || '';

    let Component: React.ComponentType<IPreviewComponentProps> | null = _.find(viewMap, m => m.type.test(fileExtension))?.Component ?? null;

    if (Component === null) {
        if (isSuffixInLanguageMap(fileExtension)) {
            Component = MonacoEditorView;
        }
    }

    if (!url) {
        return null;
    }

    if (!Component) {
        return <div className={s.notSupported}>暂不支持该文件类型</div>;
    }

    return <Component url={url} cellType={props.cellType} suffix={fileExtension}/>;
};

export default FilePreview;
