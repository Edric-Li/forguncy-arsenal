const adjustImageSize = (imageWidth: number, imageHeight: number, containerWidth: number, containerHeight: number) => {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;
  let width, height;

  if (imageRatio > containerRatio) {
    width = containerWidth;
    height = containerWidth / imageRatio;
  } else {
    height = containerHeight;
    width = containerHeight * imageRatio;
  }

  return { width, height };
};

export default adjustImageSize;
