import { Monaco } from '@monaco-editor/loader';

export const THEME_CONSTANT = {
  LANGUAGE_NAME: 'forguncy-log',
  THEME_NAME: 'log',
};

/**
 * 设置日志主题
 */
export const setLogTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme(THEME_CONSTANT.THEME_NAME, {
    base: 'vs',
    rules: [
      // 高亮规则，給代码里不同token类型的代码设置不同的显示样式。
      { token: 'data-time', foreground: '#6a9955' },
      { token: 'warn', foreground: '#CE9178' },
      { token: 'middle-bracket', foreground: '#569CD6' },
      { token: 'error', foreground: '#FF0000' },
      { token: 'json-obj-value', foreground: '#569CD6' },
    ],
    inherit: true,
    colors: {
      // 非代码部分的颜色。例如背景、滚动条等。
    },
  });
  monaco.editor.setTheme(THEME_CONSTANT.THEME_NAME);
  monaco.languages.register({ id: THEME_CONSTANT.LANGUAGE_NAME });
  // 语法解析状态机，状态state =》 匹配的规则（正则）、行为action等。
  monaco.languages.setMonarchTokensProvider(THEME_CONSTANT.LANGUAGE_NAME, {
    tokenizer: {
      root: [
        [/\d{2}:\d{2}:\d{2}\.\d{3}/, { token: 'data-time' }],
        [/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/, { token: 'data-time' }],
        [/\[\bERROR\b]/, { token: 'error' }],
        [/\[\bWARN ]/, { token: 'warn' }],

        // string
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // middle-bracket
        [/\[/, { token: 'middle-bracket', bracket: '@open', next: '@middle_bracket' }],
        [/]/, { token: 'middle-bracket', bracket: '@close' }],

        // 下面这种对于json中value的高亮规则处理其实是有问题的，会使整个文本中"null"都受影响。暂不处理。
        [/\b(null)\s*/, { token: 'json-obj-value' }],
      ],

      string: [
        [/[^"]+/, 'string'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
      ],

      // eslint-disable-next-line
      middle_bracket: [
        [/[^",\]]+/, { token: 'middle-bracket' }],
        [/]/, { token: '@rematch', next: '@pop' }],
        [/"/, 'string', '@string'],
      ],
    },
  });
};
