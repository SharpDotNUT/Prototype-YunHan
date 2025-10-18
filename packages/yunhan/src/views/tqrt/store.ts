import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import ky from 'ky';
import { useIDB } from '@/script/idb';
import { getLangID } from './util';

const IDB = new useIDB('TQRTText');

interface FileMeta {
  path: string;
  lang: string;
  size: number;
  progress?: number;
}

interface LangData {
  game: string;
  lang: string;
  size: number;
  version: string;
  files: FileMeta[];
}

export const useTQRTStore = defineStore('tqrt', () => {
  const gameMeta = ref({
    Genshin: { version: '', updated: '', files: [] as FileMeta[] },
    StarRail: { version: '', updated: '', files: [] as FileMeta[] }
  });

  const langData = ref<Record<string, LangData>>({});
  const downloading = ref<Record<string, FileMeta>>({});
  const localData = ref<Record<string, LangData>>({});
  const log = ref('');

  const textMapCache: Record<string, Record<string, string>> = {};

  const logger = (...args: any[]) => {
    log.value += `[${new Date().toLocaleTimeString()}] ${args.join(' ')}\n`;
  };

  const initialize = async () => {
    try {
      const [savedMeta, savedLangs] = await Promise.all([
        IDB.get('TQRTMeta'),
        IDB.get('TQRTLocal')
      ]);
      if (savedMeta) gameMeta.value = savedMeta;
      if (savedLangs) localData.value = savedLangs;
    } catch (e) {
      logger('初始化失败:', e);
    }
  };

  // 获取元数据
  const fetchMeta = async () => {
    try {
      const meta = (await ky
        .get('https://hoyo-textmap.sharpdotnut.com/text/meta.json')
        .json()) as any;
      gameMeta.value = meta;
      const langMap: Record<string, LangData> = {};
      for (const [game, data] of Object.entries(gameMeta.value)) {
        for (const file of data.files) {
          const langId = `${game}.${file.lang}`;
          if (!langMap[langId]) {
            langMap[langId] = {
              game,
              lang: file.lang,
              size: file.size,
              version: data.version,
              files: [toRaw(file)]
            };
          } else {
            langMap[langId].size += file.size;
            langMap[langId].files.push(toRaw(file));
          }
        }
      }
      langData.value = langMap;
      IDB.set('TQRTMeta', toRaw(gameMeta.value));
    } catch (e) {
      logger('Failed to fetch metadata:', e);
    }
  };

  // 下载语言包
  const downloadLang = async (langId: string) => {
    const lang = langData.value[langId];
    if (!lang) throw new Error(`Language not found: ${langId}`);

    // 添加到下载列表
    lang.files.forEach((file) => {
      downloading.value[file.path] = { ...file, progress: 0 };
    });

    try {
      const result: Record<string, string> = {};
      for (const file of lang.files) {
        const response = await ky.get(
          `https://hoyo-textmap.sharpdotnut.com/text/${file.path}`,
          {
            onDownloadProgress: (progress) => {
              downloading.value[file.path].progress = progress.transferredBytes;
            }
          }
        );
        Object.assign(result, await response.json());
        delete downloading.value[file.path]; // 下载完成移除
        logger(`Downloaded: ${file.path}`);
      }
      await IDB.set(langId, result);
      localData.value[langId] = lang;
      console.log(localData.value, toRaw(localData.value));
      IDB.set('TQRTLocal', toRaw(localData.value));

      logger(`Language pack downloaded: ${langId}`);
    } catch (e) {
      logger(`Downloaded failed: ${langId}`, e);
      throw e;
    }
  };

  // 搜索文本
  const searchText = async (
    game: string,
    text: string,
    lang: string,
    targetLang?: string
  ) => {
    const langId = getLangID(game, lang);
    const targetLangId = targetLang ? getLangID(game, targetLang) : undefined;

    // 加载源语言文本映射
    if (!textMapCache[langId]) {
      textMapCache[langId] = (await IDB.get(langId)) || {};
      logger(`加载文本映射: ${langId}`);
    }

    // 加载目标语言文本映射
    if (targetLangId && !textMapCache[targetLangId]) {
      textMapCache[targetLangId] = (await IDB.get(targetLangId)) || {};
      logger(`加载翻译映射: ${targetLangId}`);
    }

    const results = [];
    const sourceMap = textMapCache[langId];
    const targetMap = targetLangId ? textMapCache[targetLangId] : null;

    // 执行搜索
    for (const [id, content] of Object.entries(sourceMap)) {
      if (content.includes(text)) {
        results.push({
          id,
          text: content,
          translate: targetMap?.[id]
        });
      }
    }

    logger(`在${langId}中找到${results.length}条结果`);
    return results;
  };

  initialize();
  fetchMeta();

  return {
    gameMeta,
    langData,
    downloading: ref(downloading),
    localLangs: localData,
    log,
    fetchMeta,
    downloadLang,
    searchText,
    logger
  };
});
