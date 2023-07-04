import { WatermarkSettings } from '../declarations/types';

/**
 * 给图片添加水印
 * @param file
 * @param watermarkSettings
 */
const addWatermarkToFile = (file: File, watermarkSettings: WatermarkSettings): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        if (!context) {
          return file;
        }
        context.drawImage(image, 0, 0);
        context.fillStyle = watermarkSettings.FillStyle;
        context.font = watermarkSettings.FontSize + 'px ' + watermarkSettings.Font;
        context.fillText(watermarkSettings.Text, 80, 80);
        canvas.toBlob((blob) => {
          if (!blob) {
            return resolve(file);
          }
          const newFile = new File([blob], file.name, { type: file.type });
          resolve(newFile);
        }, file.type);
      };
      image.src = event.target.result;
    };
    reader.onerror = (event) => {
      reject(event);
    };
    reader.readAsDataURL(file);
  });
};

export default addWatermarkToFile;
