import { UploadFile } from 'antd/es/upload/interface';
import getExtname from './get-extname';
import isImageFileType from './is-image-file-type';

/**
 * 是否是图片类型（不包括svg）
 * @param file
 */
const isImageUrl = (file: UploadFile) => {
  const url: string = (file.thumbUrl || file.url) as string;
  const extension = getExtname(url);

  if (extension === 'svg') {
    return false;
  }
  if (file.type) {
    return isImageFileType(file.type);
  }

  if (/^data:image\//.test(url) || /(webp|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)) {
    return true;
  }

  if (/^data:/.test(url)) {
    return false;
  }

  return !extension;
};

export default isImageUrl;
