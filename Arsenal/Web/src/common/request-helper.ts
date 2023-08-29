import axios, { AxiosResponse } from 'axios';
import { ConflictStrategy } from '../declarations/types';
import { message } from 'antd';
import FileUploadEngine from './file-upload-engine';
import FileCacheService from './file-cache-service';
import queryString from 'query-string';

interface HttpResultData<T = { [name: string]: any }> {
  result: boolean;
  message: string;
  data: T;
  requestDuration: number;
  originalResponse: AxiosResponse;
}

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

export type HttpHandlerResult<T = object> = Promise<HttpResultData<T>>;

const convertedFiles = new Set<string>();
const zipEntries = new Map<string, string[]>();
const fileExisted = new Set<string>();

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
  return FileCacheService.getValueAndSet<Blob>(
    url,
    async () => {
      return (await fetch(url)).blob();
    },
    true,
  );
};

const getText = async (url: string): Promise<string> => {
  const file = await FileCacheService.getValueAndSet<File>(url, async () => await getFile(url));
  return file.text();
};

const getSpreadFile = async (url: string): Promise<File> => {
  return await FileCacheService.getValueAndSet<File>(url, async () => {
    const blob = await requestHelper.getBlob(url);
    return new File([blob], 'file.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  });
};

const getFile = async (url: string): Promise<File> => {
  return await FileCacheService.getValueAndSet<File>(
    url,
    async () => {
      const blob = await requestHelper.getBlob(url);
      return new File([blob], 'file', { type: blob.type });
    },
    true,
  );
};

const compressFilesIntoZip = (param: ICompressFilesIntoZip): HttpHandlerResult<string> => {
  return axios.post('/compressFilesIntoZip', param);
};

const getZipEntries = async (fileKey: string): HttpHandlerResult<string[]> => {
  if (zipEntries.has(fileKey)) {
    return {
      result: true,
      message: '',
      data: zipEntries.get(fileKey)!,
      requestDuration: 0,
      originalResponse: null!,
    };
  }

  const result = (await axios.get('/getZipEntries', {
    params: {
      fileKey,
    },
  })) as HttpResultData<string[]>;

  if (result.result) {
    zipEntries.set(fileKey, result.data);
  }
  return result;
};

const getConvertableFileExtensions = async (): HttpHandlerResult<string[]> => {
  return axios.get('/getConvertableFileExtensions');
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

const createFileConversionTask = async (
  url: string,
  targetType: string,
  forceUpdated: boolean = false,
): HttpHandlerResult<string> => {
  if (convertedFiles.has(url) && !forceUpdated) {
    return {
      result: true,
      message: 'The file has been converted.',
      data: '',
      requestDuration: 0,
      originalResponse: null!,
    };
  }

  const res = (await axios.get('/createFileConversionTask/' + FileUploadEngine.getConvertedFileToken(url, targetType, forceUpdated))) as HttpResultData<string>;

  if (res.result) {
    convertedFiles.add(url);
  }
  return res;
};

const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    if (FileCacheService.get(url) || fileExisted.has(url)) {
      return true;
    }

    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      fileExisted.add(url);
    }
    return response.ok;
  } catch (e) {
    return true;
  }
};

const checkConvertedFileExists = async (url: string, targetType: string): Promise<boolean> => {
  try {
    const response = await fetch(FileUploadEngine.getConvertedFileUrl(url, targetType, false), {
      method: 'HEAD',
    });

    if (response.ok) {
      fileExisted.add(url);
    }

    return response.ok;
  } catch (e) {
    return true;
  }
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
  getConvertableFileExtensions,
  createFileConversionTask,
  checkFileExists,
  checkConvertedFileExists,
};

export default requestHelper;
