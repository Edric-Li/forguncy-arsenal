import axios, { AxiosResponse } from 'axios';
import { ConflictStrategy } from '../declarations/types';
import { message } from 'antd';

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

const requestHelper = {
  checkFileInfo,
  initMultipartUpload,
  createSoftLink,
  uploadPart,
  completeMultipartUpload,
};

export default requestHelper;
