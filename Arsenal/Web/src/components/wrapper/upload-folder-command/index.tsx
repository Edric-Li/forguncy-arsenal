import React, { useEffect, useMemo, useRef } from 'react';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { Upload } from 'antd';
import CacheService from '../../../common/cache-service';
import useFileUploadEngine from '../../../hooks/useFileUploadEngine';
import addWatermarkToFile from '../../../common/add-watermark-to-file';
import { ConflictStrategy, WatermarkSettings } from '../../../declarations/types';
import FileUploadEngine from '../../../common/file-upload-engine';

interface ICommandParam {
  folder: string;
  conflictStrategy: ConflictStrategy;
  uploadSuccessCommand: Forguncy.Plugin.ICustomCommandObject;
  advancedSettings: {
    uploadSuccessCommandTriggerTiming: 'single' | 'all';
    enableWatermark: boolean;
    watermarkSettings: WatermarkSettings;
    enableResumableUpload: boolean;
  };
}

const UploadFolderCommandWrapper = (props: { ctx: Forguncy.Plugin.CommandBase }) => {
  const { ctx } = props;

  const fileListRef = useRef<File[]>([]);
  const uploadedFilesRef = useRef<UploadFile[]>([]);
  const uploadContainerRef = useRef<HTMLDivElement | null>(null);

  const param = useMemo(() => ctx.CommandParam as ICommandParam, []);

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

    await fileUploadEngine.addTask(newFile, (callbackInfo) => {
      Object.assign(uploadFile, callbackInfo);
      if (uploadFile.status === 'success') {
        CacheService.set(callbackInfo.url!, newFile);

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

  const renderUploadContent = () => {
    return (
      <Upload beforeUpload={handleBeforeUpload} directory>
        <div ref={uploadContainerRef}></div>
      </Upload>
    );
  };

  return renderUploadContent();
};

export default UploadFolderCommandWrapper;
