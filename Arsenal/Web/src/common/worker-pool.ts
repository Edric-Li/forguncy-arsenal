import WorkerItem from './worker-item';

class WorkerPool {
  public workerCountMax: number = navigator.hardwareConcurrency;

  private workers: WorkerItem[] = [];

  private taskQueue: Function[] = [];

  private recycleWorker(worker: WorkerItem) {
    worker.isBusy = false;
    const task = this.taskQueue.shift();
    if (task) {
      task();
    }
  }

  private createNewWorker(): WorkerItem {
    const worker = new WorkerItem();
    worker.isBusy = true;
    worker.recycle = () => this.recycleWorker(worker);
    this.workers.push(worker);
    return worker;
  }

  public take(): Promise<WorkerItem> {
    return new Promise((resolve) => {
      for (const worker of this.workers) {
        if (!worker.isBusy) {
          worker.isBusy = true;
          return resolve(worker);
        }
      }

      if (this.workers.length <= this.workerCountMax) {
        return resolve(this.createNewWorker());
      }

      this.taskQueue.push(() => this.take().then(resolve));
    });
  }
}

const workerPool = new WorkerPool();

export default workerPool;
