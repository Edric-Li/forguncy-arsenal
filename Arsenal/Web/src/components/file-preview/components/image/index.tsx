import React from 'react';
// @ts-ignore
import s from './index.module.css';

/**
 * 图片预览组件
 * @param props
 * @constructor
 */
const ImagePreview = (props:IPreviewComponentProps) => {
    return <div className={s.root}>
        <img alt='example' src={props.url} />
    </div>;
};

export default ImagePreview;

