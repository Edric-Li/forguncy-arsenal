import React, { useEffect, useMemo, useRef } from 'react';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import FileCacheService from '../../../common/file-cache-service';
import useFileUploadEngine from '../../../hooks/useFileUploadEngine';
import addWatermarkToFile from '../../../common/add-watermark-to-file';
import { ConflictStrategy, ImgCropSettings, WatermarkSettings } from '../../../declarations/types';
import FileUploadEngine from '../../../common/file-upload-engine';
import parseAccept from '../../../common/parse-accept';

interface ICommandParam {
  folder: string;
  conflictStrategy: ConflictStrategy;
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
  const multiple = useMemo(
    () => param.maxCount === null || param.maxCount === undefined || param.maxCount > 1,
    [param],
  );

  const fileUploadEngine = useFileUploadEngine({
    evaluateFormula: ctx.evaluateFormula.bind(ctx),
    enableResumableUpload: param.advancedSettings.enableResumableUpload,
    folder: param.folder,
    conflictStrategy: param.conflictStrategy,
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
      return false;
    }

    if (param.maxCount) {
      if (fileListRef.current.length >= param.maxCount) {
        messageApi.error({
          key: 'arsenal-upload-command',
          type: 'error',
          content: `上传的文件数量超出了限制, 最大上传数量为 ${param.maxCount}。`,
        });
        return false;
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

    await fileUploadEngine.addTask(newFile as RcFile, (callbackInfo) => {
      Object.assign(uploadFile, callbackInfo);
      if (uploadFile.status === 'success') {
        FileCacheService.tryPut(callbackInfo.url!, newFile);

        uploadedFilesRef.current.push(uploadFile);

        let fileKey = FileUploadEngine.extractFileNameFromUrl(uploadFile.url!);
        let fileName = uploadFile.name;

        if (param.advancedSettings.uploadSuccessCommandTriggerTiming === 'all') {
          if (uploadedFilesRef.current.length === fileListRef.current.length) {
            fileKey = uploadedFilesRef.current.map((i) => FileUploadEngine.extractFileNameFromUrl(i.url!)).join('|');
            fileName = uploadedFilesRef.current.map((i) => i.name).join('|');
          } else {
            return;
          }
        }

        ctx.executeCustomCommandObject(
          param.uploadSuccessCommand,
          {
            [param.uploadSuccessCommand.ParamProperties['fileKey']]: fileKey,
            [param.uploadSuccessCommand.ParamProperties['fileName']]: fileName,
          },
          new Date().getTime().toString() + '-' + Math.ceil(Math.random() * 1000000000),
        );
      }
    });
    return false;
  };

  const accept = useMemo(() => parseAccept(param.allowedExtensions), [param]);

  const renderUploadContent = () => {
    return (
      <Upload beforeUpload={handleBeforeUpload} multiple={multiple} accept={accept}>
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
