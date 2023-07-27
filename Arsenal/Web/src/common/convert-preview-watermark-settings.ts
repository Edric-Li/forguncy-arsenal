import { WatermarkProps } from 'antd/es/watermark';

type SettingsType = { content?: string | string[] } & Omit<IPreviewWatermarkSettings, 'content'>;

const convertPreviewWatermarkSettings = (settings: SettingsType): WatermarkProps => {
  const gap: [number, number] = [100, 100];
  let offset: [number, number] | undefined;

  settings.gap?.split(',')?.forEach((item, index) => {
    gap[index] = parseInt(item, 10);
  });

  const offsetArray = settings?.offset?.split(',') ?? [];
  if (offsetArray.length) {
    offset = [0, 0];

    settings.offset.split(',').forEach((item, index) => {
      (offset as [number, number])[index] = parseInt(item, 10);
    });
  }

  return {
    zIndex: settings.zIndex,
    rotate: settings.rotate,
    width: settings.width,
    height: settings.height,
    content: settings.content,
    font: {
      color: Forguncy.ConvertToCssColor(settings.font.color),
      fontSize: settings.font.fontSize,
      fontWeight: settings.font.fontWeight,
      fontStyle: settings.font.fontStyle,
      fontFamily: settings.font.fontFamily,
    },
    gap: gap,
    offset: offset,
  };
};

export default convertPreviewWatermarkSettings;
