import { FileHashCalculationEngine } from './file-hash-calculation-engine';
import BigNumber from 'bignumber.js';
import requestHelper, { HttpHandlerResult, IInitMultipartUploadResult } from './request-helper';
import { ConflictStrategy } from '../declarations/types';
import { UploadFile } from 'antd/es/upload/interface';

export interface FileUploadOptions {
  enableResumableUpload: boolean;
  folder: string;
  evaluateFormula: (formula: string) => unknown;
  conflictStrategy: ConflictStrategy;
}

class FileUploadEngine {
  public enableResumableUpload: boolean = false;

  public conflictStrategy: ConflictStrategy = ConflictStrategy.Rename;

  public folder: string | null = null;

  public evaluateFormula: (value: string) => unknown;

  constructor(options: FileUploadOptions) {
    this.enableResumableUpload = options.enableResumableUpload;
    this.conflictStrategy = options.conflictStrategy;
    this.folder = options.folder;
    this.evaluateFormula = options.evaluateFormula;
  }

  private getTargetFolderPath(): string | null {
    if (!this.folder?.trim().length) {
      return null;
    }
    return this.evaluateFormula(this.folder) as string;
  }

  private async initMultipartUpload(file: File): HttpHandlerResult<IInitMultipartUploadResult> {
    let targetFolderPath = this.getTargetFolderPath();

    if (file.webkitRelativePath && targetFolderPath) {
      const parts = file.webkitRelativePath.split('/');
      parts.pop();
      targetFolderPath += '/' + parts.join('/');
    }

    const fileMd5 =
      file.size !== 0 && this.enableResumableUpload && !targetFolderPath
        ? await FileHashCalculationEngine.execute(file)
        : null;

    return requestHelper.initMultipartUpload({
      fileMd5,
      fileName: file.name,
      conflictStrategy: this.conflictStrategy,
      targetFolderPath,
    });
  }

  private getFilePartBlob(file: File, num: number): Blob {
    const start = new BigNumber(num).multipliedBy(new BigNumber(FileHashCalculationEngine.chunkSize)).toNumber();
    const end = start + FileHashCalculationEngine.chunkSize;
    return file.slice(start, end);
  }

  public static getFileUrl(fileName: string): string {
    return Forguncy.Helper.SpecialPath.getBaseUrl() + 'Upload/' + fileName;
  }

  public getDownloadUrl(fileName: string): string {
    return (
      Forguncy.Helper.SpecialPath.getBaseUrl() + 'FileDownloadUpload/Download?file=' + encodeURIComponent(fileName)
    );
  }

  public download(uid: string) {
    const a = document.createElement('a');
    a.href = this.getDownloadUrl(uid);
    a.click();
    a.remove();
  }

  public async addTask(file: File, callback: (callbackInfo: Partial<UploadFile>) => void) {
    const initMultipartUploadResult = await this.initMultipartUpload(file);
    if (!initMultipartUploadResult.result) {
      return callback({
        status: 'error',
        response: initMultipartUploadResult.message,
      });
    }
    const uploadId = initMultipartUploadResult.data.uploadId;
    callback({ name: initMultipartUploadResult.data.fileName });

    const partsSet: Set<number> = new Set<number>();

    const partsCount = Math.ceil(
      new BigNumber(file.size).div(new BigNumber(FileHashCalculationEngine.chunkSize)).toNumber(),
    );

    if (this.enableResumableUpload && this.getTargetFolderPath() === null) {
      const res = await requestHelper.checkFileInfo(uploadId);

      if (res.data.exist) {
        const createVirtualFileRes = await requestHelper.createSoftLink(uploadId, file.name);
        callback({
          percent: 100,
          status: 'success',
          uid: createVirtualFileRes.data,
          url: FileUploadEngine.getFileUrl(createVirtualFileRes.data),
        });
        return;
      }

      res.data.parts.map((num) => partsSet.add(num));
    }

    let partNumber = -1;

    const getNextPartIndex = () => (++partNumber < partsCount ? partNumber : null);

    const runUploadPartTask = async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const partIndex = getNextPartIndex();

        if (partIndex === null) {
          break;
        }

        callback({ percent: Math.ceil((partNumber / partsCount) * 99) });

        if (partsSet.has(partIndex)) {
          continue;
        }
        await requestHelper.uploadPart(this.getFilePartBlob(file, partIndex), partIndex, uploadId);
      }
    };

    await Promise.all(new Array(6).fill(1).map(runUploadPartTask));
    const completeMultipartUploadRes = await requestHelper.completeMultipartUpload(uploadId);

    callback({
      percent: 100,
      status: 'success',
      name: completeMultipartUploadRes.data.fileName,
      uid: completeMultipartUploadRes.data.fileId,
      url: FileUploadEngine.getFileUrl(completeMultipartUploadRes.data.fileId),
    });
  }
}

export default FileUploadEngine;
