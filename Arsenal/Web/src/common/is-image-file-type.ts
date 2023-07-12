/**
 * 是否是图片类型
 * @param type
 */
const isImageFileType = (type: string): boolean => type.indexOf('image/') === 0;

export default isImageFileType;
