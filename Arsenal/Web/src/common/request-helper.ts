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
  name: string;
  hash: string | null;
  folderPath: string | null;
  contentType: string;
  size: number;
  conflictStrategy: ConflictStrategy;
}

export interface IInitMultipartUploadResult {
  uploadId: string;
  fileName: string;
}

export interface ICompleteMultipartUploadResult {
  fileKey: string;
  fileName: string;
}

export interface ICompressFilesIntoZip {
  zipName: string;
  fileIds: string[];
  needKeepFolderStructure: boolean;
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

const addFileRecord = (uploadId: string): HttpHandlerResult<string> => {
  return axios.post('/addFileRecord', { uploadId });
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
  const file = await cacheService.getValueAndSet<File>(url, async () => await getFile(url));
  return file.text();
};

const getSpreadFile = async (url: string): Promise<File> => {
  return await cacheService.getValueAndSet<File>(url, async () => {
    if (url.endsWith('.xls')) {
      url += '?ac=1';
    }
    const blob = await requestHelper.getBlob(url);
    return new File([blob], 'file.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  });
};

const getFile = async (url: string): Promise<File> => {
  return await cacheService.getValueAndSet<File>(url, async () => {
    const blob = await requestHelper.getBlob(url);
    return new File([blob], 'file', { type: blob.type });
  });
};

const compressFilesIntoZip = (param: ICompressFilesIntoZip): HttpHandlerResult<string> => {
  return axios.post('/compressFilesIntoZip', param);
};

const getZipEntries = async (fileKey: string): HttpHandlerResult<string[]> => {
  return axios.get('/getZipEntries', {
    params: {
      fileKey,
    },
  });
};

const generateTemporaryAccessKeyForZipFile = async (
  fileKey: string,
  targetFilePath: string,
): HttpHandlerResult<string> => {
  return axios.get('/getTemporaryAccessKeyForZipFile', {
    params: {
      fileKey,
      targetFilePath: targetFilePath,
    },
  });
};

const requestHelper = {
  checkFileInfo,
  initMultipartUpload,
  addFileRecord,
  uploadPart,
  completeMultipartUpload,
  getBlob,
  getText,
  getSpreadFile,
  getFile,
  compressFilesIntoZip,
  getZipEntries,
  generateTemporaryAccessKeyForZipFile,
};

export default requestHelper;
