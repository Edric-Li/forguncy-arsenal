const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
};

export default sleep;
