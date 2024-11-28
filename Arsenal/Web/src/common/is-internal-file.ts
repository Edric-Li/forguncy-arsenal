const isInternalFile = (str: string) => {
  // @ts-ignore
  return Forguncy.Common.isForguncyFile(str);
};

export default isInternalFile;
