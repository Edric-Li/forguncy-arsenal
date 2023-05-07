// @ts-ignore
import s from './index.module.css';

const IframeView = (props:IPreviewComponentProps) => {
    return <iframe
        title="preview"
        name="printfFrame"
        frameBorder="0"
        src={props.url}
        allowFullScreen
        className={s.root}
    />;
};

export default IframeView;
