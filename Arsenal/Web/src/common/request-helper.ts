import axios, { AxiosResponse } from 'axios';
import { ConflictStrategy } from '../declarations/types';
import { message } from 'antd';
import cacheService from './cache-service';

interface HttpResultData<T = { [name: string]: any }> {
  result: boolean;
  message: string;
  data: T;
  requestDuration: number;
  originalResponse: AxiosResponse;
}

export type HttpHandlerResult<T = object> = Promise<HttpResultData<T>>;

axios.defaults.baseURL = Forguncy.Helper.SpecialPath.getBaseUrl() + 'customapi/arsenal';

axios.interceptors.response.use(
  (response) => {
    if (!response.data.result) {
      message.error(response.data.message);
    }
    return {
      originalResponse: response,
      ...response.data,
    };
  },
  async (error) => {
    return { result: false, message: error.message };
  },
);

interface IInitMultipartUploadParam {
  fileMd5: string | null;
  targetFolderPath: string | null;
  fileName: string;
  conflictStrategy: ConflictStrategy;
}

export interface IInitMultipartUploadResult {
  uploadId: string;
  fileName: string;
}

export interface ICompleteMultipartUploadResult {
  fileId: string;
  fileName: string;
}

const excelFileTypeMap: { [key: string]: string } = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  unknown: 'unknown',
};

const checkFileInfo = (uploadId: string): HttpHandlerResult<{ exist: boolean; parts: number[] }> => {
  return axios.get('/checkFileInfo', {
    params: {
      uploadId,
    },
  });
};

const uploadPart = (file: Blob, partNumber: number, uploadId: string): HttpHandlerResult => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadId', uploadId);
  formData.append('partNumber', partNumber?.toString());
  return axios.post('uploadpart', formData, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'upload-id': uploadId,
    },
  });
};

const initMultipartUpload = (param: IInitMultipartUploadParam): HttpHandlerResult<IInitMultipartUploadResult> => {
  return axios.post('/initMultipartUpload', param);
};

const createSoftLink = (uploadId: string, fileName: string): HttpHandlerResult<string> => {
  return axios.post('/createSoftLink', { uploadId, fileName });
};

const completeMultipartUpload = (uploadId: string): HttpHandlerResult<ICompleteMultipartUploadResult> => {
  return axios.post('/completeMultipartUpload', { uploadId });
};

const getBlob = async (url: string): Promise<Blob> => {
  return cacheService.getValueAndSet<Blob>(url, async () => {
    return (await fetch(url)).blob();
  });
};

const getText = async (url: string): Promise<string> => {
  return cacheService.getValueAndSet(url, async () => (await fetch(url)).text());
};

// 后续可能会弃用掉
const getSpreadFile = async (url: string): Promise<File> => {
  return await cacheService.getValueAndSet<File>(url, async () => {
    const fileExt = url?.split('.').pop() ?? 'xlsx';
    const blob = await requestHelper.getBlob(url);
    return new File([blob], 'file.' + fileExt, { type: blob.type || excelFileTypeMap[fileExt] });
  });
};

const getFileByUrl = async (url: string): Promise<File> => {
  return await cacheService.getValueAndSet<File>(url, async () => {
    const blob = await requestHelper.getBlob(url);
    return new File([blob], 'file', { type: blob.type });
  });
};

const requestHelper = {
  checkFileInfo,
  initMultipartUpload,
  createSoftLink,
  uploadPart,
  completeMultipartUpload,
  getBlob,
  getText,
  getSpreadFile,
  getFileByUrl,
};

export default requestHelper;
