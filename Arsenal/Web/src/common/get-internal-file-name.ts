const getInternalFileName = (src: string) => {
  const parts = src.split('/');
  const lastPart = parts.at(-1);
  return lastPart?.substring(37) ?? '';
};

export default getInternalFileName;
