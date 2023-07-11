import React, { useEffect, useMemo, useRef } from 'react';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import CacheService from '../../../common/cache-service';
import useFileUploadEngine from '../../../hooks/useFileUploadEngine';
import addWatermarkToFile from '../../../common/add-watermark-to-file';
import { ConflictStrategy, ImgCropSettings, WatermarkSettings } from '../../../declarations/types';

interface ICommandParam {
  folder: string;
  allowedExtensions: string;
  maxSize: number;
  maxCount: number;
  uploadSuccessCommand: Forguncy.Plugin.ICustomCommandObject;
  advancedSettings: {
    uploadSuccessCommandTriggerTiming: 'single' | 'all';
    enableWatermark: boolean;
    watermarkSettings: WatermarkSettings;
    enableCrop: boolean;
    imgCropSettings: ImgCropSettings;
    enableResumableUpload: boolean;
  };
}

const UploadCommandWrapper = (props: { ctx: Forguncy.Plugin.CommandBase }) => {
  const { ctx } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const fileListRef = useRef<File[]>([]);
  const uploadedFilesRef = useRef<UploadFile[]>([]);
  const uploadContainerRef = useRef<HTMLDivElement | null>(null);

  const param = useMemo(() => ctx.CommandParam as ICommandParam, []);
  const multiple = useMemo(() => param.maxCount === null || param.maxCount > 0, [param]);

  const fileUpload = useFileUploadEngine({
    evaluateFormula: ctx.evaluateFormula,
    enableResumableUpload: param.advancedSettings.enableResumableUpload,
    folder: param.folder,
    conflictStrategy: ConflictStrategy.Reject,
  });

  useEffect(() => {
    uploadContainerRef.current?.click();
  }, []);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file: RcFile) => {
    if (file.size / 1024 / 1024 > param.maxSize) {
      messageApi.error({
        key: 'arsenal-upload-command',
        type: 'error',
        content: `上传的文件 ${file.name} 的大小超出了限制, 最大上传文件的大小为 ${param.maxSize} MB。`,
      });
      return;
    }

    if (param.maxCount) {
      if (fileListRef.current.length >= param.maxCount) {
        messageApi.error({
          key: 'arsenal-upload-command',
          type: 'error',
          content: `上传的文件数量超出了限制, 最大上传数量为 ${param.maxCount}。`,
        });
        return;
      }
    }

    fileListRef.current.push(file);

    const newFile =
      file.type.startsWith('image/') && param.advancedSettings.enableWatermark
        ? await addWatermarkToFile(file, param.advancedSettings.watermarkSettings)
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

        uploadedFilesRef.current.push(uploadFile);

        let fileId = uploadFile.uid;
        let fileName = uploadFile.name;

        if (param.advancedSettings.uploadSuccessCommandTriggerTiming === 'all') {
          if (uploadedFilesRef.current.length === fileListRef.current.length) {
            fileId = uploadedFilesRef.current.map((i) => i.uid).join('|');
            fileName = uploadedFilesRef.current.map((i) => i.name).join('|');
          } else {
            return;
          }
        }

        ctx.executeCustomCommandObject(
          param.uploadSuccessCommand,
          {
            [param.uploadSuccessCommand.ParamProperties['fileId']]: fileId,
            [param.uploadSuccessCommand.ParamProperties['fileName']]: fileName,
          },
          new Date().getTime().toString() + '-' + Math.ceil(Math.random() * 1000000000),
        );
      }
    });
    return false;
  };

  const renderUploadContent = () => {
    return (
      <Upload beforeUpload={handleBeforeUpload} multiple={multiple} accept={param.allowedExtensions}>
        <div ref={uploadContainerRef}></div>
      </Upload>
    );
  };

  if (param.advancedSettings.enableCrop) {
    const { centered, ...others } = param.advancedSettings.imgCropSettings;
    return (
      <ImgCrop {...others} modalProps={{ centered }}>
        {renderUploadContent()}
      </ImgCrop>
    );
  }

  return (
    <>
      {contextHolder}
      {renderUploadContent()}
    </>
  );
};

export default UploadCommandWrapper;
