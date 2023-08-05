/**
 * 获取文件扩展名
 * @param url
 */
const getExtname = (url: string = ''): string => {
  const temp = url.split('/');
  const filename = temp[temp.length - 1];
  const filenameWithoutSuffix = filename.split(/#|\?/)[0];
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0].toLowerCase();
};

export default getExtname;
