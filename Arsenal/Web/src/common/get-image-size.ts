const getImageSize = (url: string): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve([img.width, img.height]);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

export default getImageSize;
