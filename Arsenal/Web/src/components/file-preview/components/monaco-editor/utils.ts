const languageMap: { [key: string]: string } = {
  '.txt': 'plaintext',
  '.abap': 'abap',
  '.cls': 'apex',
  '.azcli': 'azcli',
  '.bat': 'bat',
  '.bicep': 'bicep',
  '.mj': 'cameligo',
  '.clj': 'clojure',
  '.coffee': 'coffeescript',
  '.c': 'c',
  '.cpp': 'cpp',
  '.cs': 'csharp',
  '.csp': 'csp',
  '.css': 'css',
  '.cypher': 'cypher',
  '.dart': 'dart',
  '.dockerfile': 'dockerfile',
  '.ecl': 'ecl',
  '.ex': 'elixir',
  '.f9': 'flow9',
  '.fs': 'fsharp',
  '.ftl': 'freemarker2',
  '.go': 'go',
  '.gql': 'graphql',
  '.hbs': 'handlebars',
  '.hcl': 'hcl',
  '.html': 'html',
  '.ini': 'ini',
  '.java': 'java',
  '.js': 'javascript',
  '.jl': 'julia',
  '.kt': 'kotlin',
  '.less': 'less',
  '.lx': 'lexon',
  '.lua': 'lua',
  '.liquid': 'liquid',
  '.m3': 'm3',
  '.md': 'markdown',
  '.s': 'mips',
  '.msdax': 'msdax',
  '.sql': 'mysql',
  '.m': 'objective-c',
  '.pas': 'pascal',
  '.pig': 'pascaligo',
  '.pl': 'perl',
  '.pgsql': 'pgsql',
  '.php': 'php',
  '.pla': 'pla',
  '.dats': 'postiats',
  '.pq': 'powerquery',
  '.ps1': 'powershell',
  '.proto': 'proto',
  '.pug': 'pug',
  '.py': 'python',
  '.qs': 'qsharp',
  '.r': 'r',
  '.cshtml': 'razor',
  '.redis': 'redis',
  '.rst': 'restructuredtext',
  '.rb': 'ruby',
  '.sb': 'sb',
  '.scala': 'scala',
  '.scm': 'scheme',
  '.scss': 'scss',
  '.sh': 'shell',
  '.sol': 'sol',
  '.aes': 'aes',
  '.rq': 'sparql',
  '.st': 'st',
  '.swift': 'swift',
  '.sv': 'systemverilog',
  '.v': 'verilog',
  '.tcl': 'tcl',
  '.twig': 'twig',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.vb': 'vb',
  '.wgsl': 'wgsl',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.json': 'json',
};

// 根据后缀名获取语言名称
export function getLanguageNameBySuffix(suffix: string) {
  return languageMap['.' + suffix];
}

// 后缀名是否在语言列表中
export function isSuffixInLanguageMap(suffix: string) {
  return !!languageMap['.' + suffix];
}
