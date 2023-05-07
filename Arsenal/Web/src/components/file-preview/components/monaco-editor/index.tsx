import Editor from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import {useEffect, useState} from 'react';
import getBlobObjectFromUrl from '../../../../common/get-blob-object-from-url';

loader.config({
    'paths': {
        vs: '/Forguncy/3D5AA5F0-2CFC-D509-4430-F52458E5EECC' + '/monaco.editor.cdn/min/vs'
    },
    'vs/nls': {
        availableLanguages: { '*': 'zh-cn' }
    }
});

const options = {
    selectOnLineNumbers: true,
    readOnly: true,
};

const MonacoEditorView = (props:IPreviewComponentProps) => {

    const [value, setValue] = useState('');

    useEffect(() => {
        (async () => {
            const blob = await getBlobObjectFromUrl(props.url);
            setValue(await blob.text());
        })();
    }, []);
    return <div style={{width: '100%', height: '100%', border: '1px solid #ced4da'}}>
        <Editor
            width="100%"
            height="100%"
            language="json"
            value={value}
            options={options}
        />
    </div>;
};

export default MonacoEditorView;
