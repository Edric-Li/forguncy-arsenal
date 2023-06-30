import React, {CSSProperties} from 'react';

const style:CSSProperties = {
    width:'100%',
    height:'100%',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',

};

/**
 * 图片预览组件
 * @param props
 * @constructor
 */
const ImagePreview = (props:IPreviewComponentProps) => {
    return <div style={style}>
        <img alt='' src={props.url}/>
    </div>;
};

export default ImagePreview;

