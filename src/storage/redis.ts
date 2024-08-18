import { createClient, RedisClientType } from 'redis';

class Storage {
  private static instance: RedisClientType | null = null;

  public static async getInstance(): Promise<RedisClientType> {
    if (!Storage.instance) {
      Storage.instance = createClient({ url: 'redis://localhost:6379' });
      Storage.instance.on('connect', () =>
        console.log('Redis Client Connected')
      );
      Storage.instance.on('error', (err: any) =>
        console.log('Redis Client Error', err)
      );
      await Storage.instance.connect();
    }
    return Storage.instance;
  }

  public async disconnect(): Promise<void> {
    if (Storage.instance) {
      await Storage.instance.disconnect();
    }
  }
}

export default Storage;
