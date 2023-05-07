import React from 'react';

/**
 * 图片预览组件
 * @param props
 * @constructor
 */
const ImagePreview = (props:IPreviewComponentProps) => {
    return <img alt='example' style={{width: '100%'}} src={props.url}/>;
};

export default ImagePreview;

