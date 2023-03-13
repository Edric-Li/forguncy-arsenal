import SparkMD5 from 'spark-md5';
import BigNumber from 'bignumber.js';
import workerPool from './worker-pool';
import WorkerItem from './worker-item';

export class FileHashCalculationEngine {
  public static chunkSize = 10 * 1024 * 1024;
  public static enableCache = true;

  private static getCacheKeyByFile(file: File) {
    return 'ARSENAL-' + SparkMD5.hash(`${file.name}-${file.size}-${file.lastModified}`);
  }

  private static getFileHashFromCache(file: File) {
    return localStorage.getItem(this.getCacheKeyByFile(file));
  }

  private static saveFileHashToCache(file: File, hash: string) {
    return localStorage.setItem(this.getCacheKeyByFile(file), hash);
  }

  private static splittingFiles(file: File): Array<File> {
    const chunks = Math.ceil(
      new BigNumber(file.size).div(new BigNumber(FileHashCalculationEngine.chunkSize)).toNumber(),
    );

    const parts = new Array(chunks);

    for (let i = 0; i < chunks; i++) {
      const start = i * FileHashCalculationEngine.chunkSize;
      const end = start + FileHashCalculationEngine.chunkSize;
      parts[i] = file.slice(start, end);
    }

    return parts;
  }

  public static execute(file: File): Promise<string> {
    return new Promise(async (resolve) => {
      if (this.enableCache) {
        const cacheHash = this.getFileHashFromCache(file);

        if (cacheHash !== null) {
          return resolve(cacheHash);
        }
      }

      const chunks = Math.ceil(
        new BigNumber(file.size).div(new BigNumber(FileHashCalculationEngine.chunkSize)).toNumber(),
      );
      const parts = this.splittingFiles(file);
      const partsHashResult = new Array(chunks);
      const actualWorkerCount = Math.min(workerPool.workerCountMax, chunks);

      let currentIndex = -1;
      let quantityCompleted = 0;

      const getNextPartInfo = (): { index: number; file: File } | null => {
        currentIndex++;
        if (currentIndex >= chunks) {
          return null;
        }
        return {
          index: currentIndex,
          file: parts[currentIndex],
        };
      };

      const terminateWorker = (worker: WorkerItem) => {
        worker.recycle();

        if (quantityCompleted === chunks) {
          const md5 = SparkMD5.hash(partsHashResult.join('-'));
          this.saveFileHashToCache(file, md5);
          return resolve(md5);
        }
      };

      for (let i = 0; i < actualWorkerCount; i++) {
        workerPool.take().then(async (worker: WorkerItem) => {
          while (true) {
            const partInfo = getNextPartInfo();

            if (partInfo === null) {
              terminateWorker(worker);
              break;
            }

            partsHashResult[partInfo.index] = await worker.execute(partInfo.index, partInfo.file);
            quantityCompleted++;
          }
        });
      }
    });
  }
}
