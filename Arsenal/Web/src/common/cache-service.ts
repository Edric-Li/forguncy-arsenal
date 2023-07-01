class CacheService {
  private static _instance: CacheService;

  private _cache: Map<string, any> = new Map<string, any>();

  public static get instance() {
    return (CacheService._instance ??= new CacheService());
  }

  public async getValueAndSet<T = string>(key: string, cb: (key: string) => Promise<T>): Promise<T> {
    const cachedData = CacheService.instance.get(key);

    if (cachedData) {
      return cachedData;
    }

    const value = await cb(key);
    CacheService.instance.set(key, value);
    return value;
  }

  get(key: string): any {
    return this._cache.get(key);
  }

  set(key: string, value: any) {
    return this._cache.set(key, value);
  }
}

export default CacheService.instance;
