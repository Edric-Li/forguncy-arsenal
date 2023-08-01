/**
 * 解析 Accept 字符串
 * @param str
 */
const parseAccept = (str: string): string => {
  if (!str?.length || str === '*') {
    return '*';
  }
  return str
    .replace(/，/g, ',')
    .split(',')
    .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`))
    .join(',');
};

export default parseAccept;
