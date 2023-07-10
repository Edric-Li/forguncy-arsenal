import isGUID from './isGUID';

const isInternalFile = (str: string) => {
  return isGUID(str.substring(0, 36)) && str[36] === '_';
};

export default isInternalFile;
