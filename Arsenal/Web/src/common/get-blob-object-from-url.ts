/**
 * 通过url获取blob对象
 * @param url
 */
const getBlobObjectFromUrl = (url: string): Promise<Blob> => {
  return new Promise((resolve) => {
    fetch(url).then((res) => resolve(res.blob()));
  });
};

export default getBlobObjectFromUrl;
