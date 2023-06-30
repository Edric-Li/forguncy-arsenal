import {CSSProperties} from 'react';

const style:CSSProperties = {
    flex:1,
    display: 'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'100%',
};

const IframeView = (props:IPreviewComponentProps) => {
    return (
        <iframe
            style={style}
            title="preview"
            name="printfFrame"
            frameBorder="0"
            src={props.url}
            allowFullScreen
        />);
};

export default IframeView;
