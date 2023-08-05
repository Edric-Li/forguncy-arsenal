/**
 * 文件缓存服务
 * 用于缓存文件内容，避免重复请求来提高性能
 */
class FileCacheService {
  private static _instance: FileCacheService;

  /**
   * 缓存的Map集合
   * @private
   */
  private _cache: Map<string, any> = new Map<string, any>();

  /**
   * 缓存最大大小
   * @private
   */
  private _maxCacheSize: number = 100 * 1024 * 1024; // 100MB

  /**
   * 当前缓存大小
   * @private
   */
  private _currentCacheSize: number = 0;

  /**
   * 单个文件最大缓存大小
   * @private
   */
  private _singleFileMaxSize: number = 5 * 1024 * 1024;

  /**
   * 调用次数
   * @private
   */
  private _callCount = 0;

  /**
   * 最大调用次数，超过后将不禁用缓存，且清空所有缓存，直到下次强制缓存时才会重新启用
   * @private
   */
  private _maxCallCount = 100;

  /**
   * 是否禁用缓存
   * @private
   */
  private _isDisabled: boolean = false;

  private static cachedFileExtensions: Set<string> = new Set<string>([
    '.mp3',
    '.wav',
    '.ogg',
    '.aac',
    '.flac',
    '.audio',
    '.mp4',
    '.webm',
    '.video',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.svg',
    '.xlsx',
  ]);

  public static get instance() {
    return (FileCacheService._instance ??= new FileCacheService());
  }

  public async getValueAndSet<T = string>(
    key: string,
    cb: (key: string) => Promise<T>,
    forceCached: boolean = false,
  ): Promise<T> {
    const cachedData = FileCacheService.instance.get(key);

    if (cachedData) {
      return cachedData;
    }

    const value = await cb(key);
    FileCacheService.instance.tryPut(key, value, forceCached);
    return value;
  }

  get(key: string): any {
    return this._cache.get(key);
  }

  calculateSize(value: any): number {
    if (!value) {
      return 0;
    }

    let sizeInBytes = 0;

    if (typeof value === 'string') {
      sizeInBytes = new Blob([value]).size;
    } else if (value instanceof Blob || value instanceof File) {
      sizeInBytes = value.size;
    }

    if (sizeInBytes === 0) {
      return 0;
    }

    return Math.ceil(sizeInBytes / 1024);
  }

  tryPut(key: string, value: any, forceCached: boolean = false): boolean {
    this._callCount++;

    if (this._isDisabled && !forceCached) {
      return false;
    }

    // 如果没有被禁用，且调用次数超过最大调用次数，且不是强制缓存，则禁用缓存，并清空所有缓存，直到下次强制缓存时才会重新启用
    if (this._callCount > this._maxCallCount) {
      this._cache.clear();
      this._isDisabled = true;
      return false;
    }

    if (!forceCached) {
      const ext = key.split('.').pop() || '';

      if (!FileCacheService.cachedFileExtensions.has(ext)) {
        return false;
      }
    }

    const size = this.calculateSize(value);

    if (size === 0) {
      return false;
    }

    if (size > this._singleFileMaxSize) {
      return false;
    }

    if (this._currentCacheSize + size > this._maxCacheSize) {
      return false;
    }

    this._currentCacheSize += size;

    this._cache.set(key, value);

    return true;
  }
}

export default FileCacheService.instance;
