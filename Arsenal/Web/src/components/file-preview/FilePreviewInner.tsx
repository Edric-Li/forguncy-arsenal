import React, {useMemo} from 'react';
import IframeView from './components/iframe';
import ImagePreview from './components/image';
import ExcelPreview from './components/excel';
import DocxPreview from './components/docx';
import _ from 'lodash';
import {isSuffixInLanguageMap} from './components/monaco-editor/utils';
import MonacoEditorView from './components/monaco-editor';
// @ts-ignore
import s from './index.module.css';

const viewMap:{
    type: RegExp;
    Component: React.ComponentType<IPreviewComponentProps>;
}[] = [
    { type: /mp4|webm|ogg|avi|wmv|mp3|aac|wav|pdf/, Component: IframeView },
    { type: /jpg|jpeg|png|gif|bmp|webp/, Component: ImagePreview },
    { type: /xlsx|xls/, Component: ExcelPreview },
    { type: /doc|docx/, Component: DocxPreview },
];

const FilePreviewInner = (props:{url:string | null | undefined}) => {
    const fileExtension = useMemo(() => props.url?.split('.').pop(), [props.url]) || '';

    let Component: React.ComponentType<IPreviewComponentProps> | null = _.find(viewMap, m => m.type.test(fileExtension))?.Component ?? null;

    if (Component === null) {
        if (isSuffixInLanguageMap(fileExtension)) {
            Component = MonacoEditorView;
        }
    }

    if (!props.url) {
        return null;
    }

    if (!Component) {
        return <div className={s.notSupported}>暂不支持该文件类型</div>;
    }

    return <Component url={props.url} suffix={fileExtension}/>;
};

export default FilePreviewInner;
