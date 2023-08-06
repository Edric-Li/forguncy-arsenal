/**
 * 获取文件扩展名
 * @param url 文件路径
 * @param includeDecimalSeparator 是否包含小数点, 默认包含
 */
const getExtname = (url = '', includeDecimalSeparator = true): string => {
  const temp = url.split('/');
  const filename = temp[temp.length - 1];
  const filenameWithoutSuffix = filename.split(/#|\?/)[0];
  const str = (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0].toLowerCase();
  return includeDecimalSeparator ? str : str.replace('.', '');
};

export default getExtname;
