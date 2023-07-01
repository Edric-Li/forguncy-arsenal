import loader, { Monaco } from '@monaco-editor/loader';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { getLanguageNameBySuffix } from './utils';
import { editor } from '../../../../declarations/editor.api';
import requestHelper from '../../../../common/request-helper';

loader.config({
  paths: {
    vs: Forguncy.Helper.SpecialPath.getBaseUrl() + '3D5AA5F0-2CFC-D509-4430-F52458E5EECC' + '/monaco.editor.cdn/min/vs',
  },
  'vs/nls': {
    availableLanguages: { '*': 'zh-cn' },
  },
});

const style: CSSProperties = {
  width: '100%',
  height: '100%',
  border: '1px solid #ced4da',
};

const MonacoEditorView = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const loaderRef = useRef<Promise<Monaco> | null>(null);

  const [value, setValue] = useState('');
  const [language, setLanguage] = useState<string | null>(null);

  useMemo(() => setLanguage(getLanguageNameBySuffix(props.suffix).toLowerCase()), [props.suffix]);

  useEffect(() => {
    (async () => {
      loaderRef.current = loader.init();
      setValue(await requestHelper.getText(props.url));
    })();

    return () => {
      // @ts-ignore
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!language || !value) {
      return;
    }
    loaderRef.current?.then((monaco) => {
      editorRef.current = monaco.editor.create(rootRef.current!, {
        language: language,
        value: value,
        selectOnLineNumbers: true,
        readOnly: true,
      }) as editor.IStandaloneCodeEditor;
    });
  }, [value, language]);

  return <div style={style} ref={rootRef}></div>;
};

export default MonacoEditorView;
