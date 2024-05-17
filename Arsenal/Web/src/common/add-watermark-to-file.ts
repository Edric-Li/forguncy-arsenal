import { WatermarkSettings } from '../declarations/types';

/**
 * 给图片添加水印
 * @param file
 * @param settings
 * @param evaluateFormula
 */
const addWatermarkToFile = (
    file: File,
    settings: WatermarkSettings,
    evaluateFormula: (formula: string) => unknown,
): Promise<File> => {
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
        context.fillStyle = Forguncy.ConvertToCssColor(settings.fillStyle);
        context.font = settings.fontSize + 'px ' + settings.fontFamily;
        context.fillText(evaluateFormula(settings.text) as string, settings.x, settings.y);
        canvas.toBlob((blob) => {
          if (!blob) {
            return resolve(file);
          }
          const newFile = new File([blob], file.name, { type: file.type });
          resolve(newFile);
        }, file.type);
      };
      image.onerror = () => {
        resolve(file);
      };
      image.src = event.target.result;
    };
    reader.onerror = (event) => {
      resolve(file);
    };
    reader.readAsDataURL(file);
  });
};

export default addWatermarkToFile;
