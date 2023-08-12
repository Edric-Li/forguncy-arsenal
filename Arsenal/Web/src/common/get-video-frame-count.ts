const getVideoFrameCount = (video: any) => {
  const mediaTimeRanges = video.seekable;
  if (mediaTimeRanges.length) {
    return (
      video.frames ||
      video.webkitDecodedFrameCount ||
      video.mozDecodedFrames ||
      video.msDecodedFrames ||
      video.oDecodedFrames ||
      video.decodedFrameCount
    );
  }
  return null;
};

export default getVideoFrameCount;
