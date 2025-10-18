import { openDB } from 'idb';

export const dbPromise = openDB('Prototype.YunHan', 2, {
  upgrade(db, old) {
    if (old < 1) db.createObjectStore('Resources');
    if (old < 2) db.createObjectStore('TQRTText');
  }
});

export class useIDB {
  private dbName = '';
  constructor(name: string) {
    this.dbName = name;
  }
  async get(key: IDBValidKey) {
    return await (await dbPromise).get(this.dbName, key);
  }
  async set(key: IDBValidKey, val: any) {
    return await (await dbPromise).put(this.dbName, val, key);
  }
  async del(key: IDBValidKey) {
    return await (await dbPromise).delete(this.dbName, key);
  }
}
