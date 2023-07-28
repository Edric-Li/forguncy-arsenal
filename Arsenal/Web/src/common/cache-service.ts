class CacheService {
  private static _instance: CacheService;

  private _cache: Map<string, any> = new Map<string, any>();

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
    '.docx',
  ]);

  public static get instance() {
    return (CacheService._instance ??= new CacheService());
  }

  public async getValueAndSet<T = string>(key: string, cb: (key: string) => Promise<T>): Promise<T> {
    const cachedData = CacheService.instance.get(key);

    if (cachedData) {
      return cachedData;
    }

    const value = await cb(key);
    CacheService.instance.trySet(key, value);
    return value;
  }

  get(key: string): any {
    return this._cache.get(key);
  }

  trySet(key: string, value: any): boolean {
    const ext = key.split('.').pop() || '';

    if (!CacheService.cachedFileExtensions.has(ext)) {
      return false;
    }

    this._cache.set(key, value);
    return true;
  }
}

export default CacheService.instance;
