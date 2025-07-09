import { dbPromise } from '@/script/idb';
import { openDB } from 'idb';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

function resourceKeyToString(id: string, variant?: string) {
  if (variant) {
    return `${id}_${variant}`;
  } else {
    return id;
  }
}
function logger(...args: any[]) {
  console.info('[RM]', ...args);
}

interface StaticResourceMetaRecord {
  id: string;
  ext: string;
  variants?: string[];
  hash: string;
  updatedAt: number;
}

export interface StaticResourceMeta {
  updatedAt: number;
  resources: Record<string, StaticResourceMetaRecord>;
}

export interface CacheResourceRecord {
  size: number;
  hash: string;
  updatedAt: number;
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
  let StaticMetaData = ref<StaticResourceMeta | null>(null);
  let CacheMeta = new Map<string, CacheResourceRecord>();
  let MetaURL: string;
  const CacheMetaKey = 'Yunhan-CacheMeta';
  const router = useRouter();

  function check() {
    if (StaticMetaData.value === null) {
      router.push('app/wait-for-meta');
    }
  }

  const saveCacheMeta = async () => {
    const entries = Array.from(CacheMeta.entries());
    localStorage.setItem(CacheMetaKey, JSON.stringify(entries));
  };

  MetaURL = import.meta.env.VITE_RESOURCE_HOST;
  if (localStorage.getItem(CacheMetaKey)) {
    CacheMeta = new Map(JSON.parse(localStorage.getItem('Yunhan-CacheMeta')!));
  }
  fetch(MetaURL + '/meta.json')
    .then((res) => res.json())
    .then((data) => {
      StaticMetaData.value = data;
    });

  // 获取资源
  async function get(id: string, variant?: string, force?: boolean) {
    if (!StaticMetaData.value) throw new Error('StaticMetaData not loaded');
    const key = resourceKeyToString(id, variant);
    await prefetch(id, variant, force);
    const data = await IDBGet(key);
    console.log(data);
    if (!data) {
      logger(`Resource ${key} not found`);
      CacheMeta.delete(key);
      saveCacheMeta();
      // await prefetch(id, variant, true)
    }
    return await IDBGet(key);
  }

  // 预取资源
  async function prefetch(id: string, variant?: string, force?: boolean) {
    if (!StaticMetaData.value) throw new Error('StaticMetaData not loaded');
    const key = resourceKeyToString(id, variant);
    const resourceMeta = StaticMetaData.value.resources[id];
    if (!resourceMeta) throw new Error(`Resource ${key} not found`);
    const cacheMeta = CacheMeta.get(key);
    let isExpired = false;
    if (cacheMeta) {
      isExpired = cacheMeta.hash != resourceMeta.hash;
      if (isExpired && cacheMeta.hash && cacheMeta.hash) {
        logger(`Resource ${key} expired, fetching...`);
      }
    } else {
      logger(`Resource ${key} not found in cache, fetching...`);
    }
    if (cacheMeta && !isExpired && (force == undefined || !force)) {
      logger(CacheMeta, !isExpired, force);
      logger(`Resource  ${key}'s cache is valid, skipping fetch`);
      return cacheMeta;
    } else {
      let url = '';
      if (variant) {
        url = `${MetaURL}/res/${resourceMeta.id}/${variant}.${resourceMeta.ext}`;
      } else {
        url = `${MetaURL}/res/${resourceMeta.id}.${resourceMeta.ext}`;
      }
      const res = await fetch(url);
      const resClone = res.clone();

      const reader = resClone.body!.getReader();
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value!.length;
      }

      const data = await res.json();
      const hash = StaticMetaData.value.resources[id]?.hash;
      await IDBSet(key, data);
      CacheMeta.set(key, {
        size,
        hash,
        updatedAt: data.updatedAt
      });
      await saveCacheMeta();
      return CacheMeta.get(key);
    }
  }

  async function remove(id: string, variant?: string) {
    if (!StaticMetaData.value) throw new Error('StaticMetaData not loaded');
    const key = resourceKeyToString(id, variant);
    CacheMeta.delete(key);
    IDBDel(key);
    saveCacheMeta();
    logger(`Removed resource ${key}`);
  }

  async function removeByKey(key: string) {
    if (!StaticMetaData.value) throw new Error('StaticMetaData not loaded');
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
    check,
    get,
    getLocalMeta,
    prefetch,
    remove,
    removeByKey,
    StaticMetaData
  };
});
