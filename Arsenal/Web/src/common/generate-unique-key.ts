const generateUniqueKey = (prefix: string) => {
  return `${prefix}-${new Date().getTime().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export default generateUniqueKey;
