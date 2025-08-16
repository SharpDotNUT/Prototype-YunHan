import { dbPromise } from '@/script/idb';
import ky from 'ky';
import { defineStore } from 'pinia';
import { ref } from 'vue';

function logger(...args: any[]) {
  console.info('[RM]', ...args);
}

interface I_StaticResourceMetaRecord {
  hash: string;
  size: number;
}
export interface I_StaticResourceMeta {
  updatedAt: number;
  version: string;
  res: Record<string, I_StaticResourceMetaRecord>;
}
export interface I_CacheResourceRecord {
  size: number;
  hash: string;
  version: string;
}

export async function IDBGet(key: IDBValidKey) {
  return (await dbPromise).get('Resources', key);
}

export async function IDBSet(key: IDBValidKey, val: any) {
  return (await dbPromise).put('Resources', val, key);
}

export async function IDBDel(key: IDBValidKey) {
  return (await dbPromise).delete('Resources', key);
}

export const useRM = defineStore('RM', () => {
  let StaticMetaData = ref<I_StaticResourceMeta | null>(null);
  let CacheMeta = new Map<string, I_CacheResourceRecord>();
  let MetaURL: string;
  const CacheMetaKey = 'Yunhan-CacheMeta';
  let fetchMetaPromise: Promise<void> | null = null;

  MetaURL = import.meta.env.VITE_RESOURCE_HOST;
  if (localStorage.getItem(CacheMetaKey)) {
    CacheMeta = new Map(JSON.parse(localStorage.getItem('Yunhan-CacheMeta')!));
  }

  const fetchMeta = async () => {
    if (fetchMetaPromise) return fetchMetaPromise;
    fetchMetaPromise = ky
      .get(MetaURL + '/meta.json')
      .then((res) => res.json())
      .then((data: any) => {
        StaticMetaData.value = data;
      })
      .finally(() => {
        fetchMetaPromise = null; // Reset when done
      });
    return fetchMetaPromise;
  };
  fetchMeta();

  const saveCacheMeta = async () => {
    const entries = Array.from(CacheMeta.entries());
    localStorage.setItem(CacheMetaKey, JSON.stringify(entries));
  };

  type TOnload = (received: number, total: number) => any;
  // 获取资源
  async function get(path: string, force?: boolean, onload?: TOnload) {
    if (!StaticMetaData.value) {
      await fetchMeta();
    }
    await prefetch(path, force, onload);
    const data = await IDBGet(path);
    if (!data) {
      logger(`Resource ${path} not found`);
      CacheMeta.delete(path);
      saveCacheMeta();
    }
    return await IDBGet(path);
  }

  // 预取资源
  async function prefetch(path: string, force?: boolean, onload?: TOnload) {
    if (!StaticMetaData.value) {
      await fetchMeta();
    }
    const resourceMeta = StaticMetaData.value!.res[path];
    if (!resourceMeta) throw new Error(`Resource ${path} not found`);
    const cacheMeta = CacheMeta.get(path);
    let isExpired = false;
    if (cacheMeta) {
      isExpired = cacheMeta.hash != resourceMeta.hash;
      if (isExpired && cacheMeta.hash && cacheMeta.hash) {
        logger(`Resource ${path} expired, fetching...`);
      }
    } else {
      logger(`Resource ${path} not found in cache, fetching...`);
    }
    if (cacheMeta && !isExpired && (force == undefined || !force)) {
      logger(CacheMeta, !isExpired, force);
      logger(`Resource  ${path}'s cache is valid, skipping fetch`);
      return cacheMeta;
    } else {
      const url = `${MetaURL}/${path}`;
      const res = await ky.get<any>(url, {
        onDownloadProgress: onload
          ? (progress) => {
              onload(progress.transferredBytes, progress.totalBytes);
            }
          : undefined
      });
      const resClone = res.clone();

      const reader = resClone.body!.getReader();
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value!.length;
      }

      const data = await res.json();
      const hash = StaticMetaData.value!.res[path]?.hash;
      await IDBSet(path, data);
      CacheMeta.set(path, {
        size,
        hash,
        version: StaticMetaData.value!.version
      });
      await saveCacheMeta();
      return CacheMeta.get(path);
    }
  }

  async function remove(path: string) {
    if (!StaticMetaData.value) {
      await fetchMeta();
    }
    CacheMeta.delete(path);
    IDBDel(path);
    saveCacheMeta();
    logger(`Removed resource ${path}`);
  }

  async function removeByKey(key: string) {
    if (!StaticMetaData.value) {
      await fetchMeta();
    }
    CacheMeta.delete(key);
    IDBDel(key);
    saveCacheMeta();
    logger(`Removed resource ${key}`);
  }

  async function getLocalMeta() {
    const totalSize = Array.from(CacheMeta.entries()).reduce(
      (sum, record) => sum + record[1].size,
      0
    );
    const { quota, usage } = await navigator.storage.estimate();
    return {
      total: quota,
      used: usage,
      cacheUsed: totalSize,
      resources: Object.fromEntries(CacheMeta.entries())
    };
  }

  return {
    get,
    getLocalMeta,
    prefetch,
    remove,
    removeByKey,
    StaticMetaData
  };
});
