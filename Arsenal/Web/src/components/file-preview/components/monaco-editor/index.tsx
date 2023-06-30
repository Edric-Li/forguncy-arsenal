import loader from '@monaco-editor/loader';
import {CSSProperties, useEffect, useMemo, useRef, useState} from 'react';
import getBlobObjectFromUrl from '../../../../common/get-blob-object-from-url';
import {getLanguageNameBySuffix} from './utils';

loader.config({
    'paths': {
        vs: Forguncy.Helper.SpecialPath.getBaseUrl() + '3D5AA5F0-2CFC-D509-4430-F52458E5EECC' + '/monaco.editor.cdn/min/vs'
    },
    'vs/nls': {
        availableLanguages: {'*': 'zh-cn'}
    }
});
const initPromise = loader.init();

const style: CSSProperties = {
    width: '100%',
    height: '100%',
    border: '1px solid #ced4da',
};

const MonacoEditorView = (props: IPreviewComponentProps) => {
    const rootRef = useRef(null);
    const editorRef = useRef(null);
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState<string | null>(null);

    useMemo(() => {
        setLanguage(getLanguageNameBySuffix(props.suffix).toLowerCase());
    }, [props.suffix]);

    useEffect(() => {
        (async () => {
            const blob = await getBlobObjectFromUrl(props.url);
            setValue(await blob.text());
        })();
        
        return ()=>{
            // @ts-ignore
            editorRef.current?.dispose();
        }
    }, []);
    
    useEffect(()=>{
        if(!language || !value){
            return;
        }
        initPromise.then(()=>{
            // @ts-ignore
            editorRef.current = window.monaco.editor.create(rootRef.current, {
                width:"100%",
                height:"100%",
                language:language,
                value:value,
                selectOnLineNumbers: true,
                readOnly: true,
            });
        })
    },[value,language])

    return <div style={style} ref={rootRef}></div>;
};

export default MonacoEditorView;
