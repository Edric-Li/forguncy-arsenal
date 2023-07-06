import React, { useEffect, useMemo, useRef } from 'react';
import { UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import CacheService from '../../common/cache-service';
import { Upload } from 'antd';
import useFileUploadEngine from '../../hooks/useFileUploadEngine';
import { ImgCropSettings, WatermarkSettings } from '../../declarations/types';
import addWatermarkToFile from '../../common/add-watermark-to-file';
import ImgCrop from 'antd-img-crop';

interface ICommandParam {
  enableCrop: boolean;
  enableResumableUpload: boolean;
  folder: string;
  allowMultipleSelections: boolean;
  allowedExtensions: boolean;
  enableWatermark: boolean;
  imgCropSettings: ImgCropSettings;
  watermarkSettings: WatermarkSettings;
}

const UploadCommandWrapper = (props: { ctx: Forguncy.Plugin.CommandBase }) => {
  const uploadContainerRef = useRef<HTMLDivElement | null>(null);
  const { ctx } = props;
  const param = useMemo(() => {
    return ctx.CommandParam as ICommandParam;
  }, []);

  const fileUpload = useFileUploadEngine({
    evaluateFormula: ctx.evaluateFormula,
    enableResumableUpload: param.enableResumableUpload,
    folder: param.folder,
  });

  useEffect(() => {
    uploadContainerRef.current?.click();
  }, []);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const newFile =
      file.type.startsWith('image/') && param.enableWatermark
        ? await addWatermarkToFile(file, param.watermarkSettings)
        : file;

    const uploadFile: UploadFile = {
      uid: file.uid,
      name: newFile.name,
      status: 'uploading',
      percent: 0,
    };

    await fileUpload.addTask(newFile, (callbackInfo) => {
      Object.assign(uploadFile, callbackInfo);
      if (uploadFile.status === 'success') {
        CacheService.set(callbackInfo.url!, newFile);
      }
    });
    return false;
  };

  const renderUploadContent = () => {
    return (
      <Upload beforeUpload={handleBeforeUpload}>
        <div ref={uploadContainerRef}></div>
      </Upload>
    );
  };

  if (param.enableCrop) {
    const { centered, ...others } = param.imgCropSettings;
    return (
      <ImgCrop {...others} modalProps={{ centered }}>
        {renderUploadContent()}
      </ImgCrop>
    );
  }

  return renderUploadContent();
};

export default UploadCommandWrapper;
