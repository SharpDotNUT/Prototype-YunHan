import { defineStore } from 'pinia';
import { ref, toRaw, watch } from 'vue';
import ky from 'ky';
import { useIDB } from '@/script/idb';
import { getLangID } from './util';

const IDB = new useIDB('TQRTText');

interface Files {
  name: string;
  lang: string;
  size: number;
  progress?: number;
}

interface TQRTMeta {
  files: Files[];
  version: string;
  updated: string;
}

interface LangData {
  game: string;
  lang: string;
  size: number;
  files: Files[];
}

export const useTQRTStore = defineStore('tqrt', () => {
  const Data = ref({
    files: [] as Files[],
    langData: {} as Record<string, LangData>,
    meta: {} as Record<string, string>
  });
  const TextMap: Record<string, Record<string, string>> = {};
  const Downloading = ref<Files[]>([]);
  const Local = ref(new Set<string>());
  const Log = ref('');
  const logger = (...args: any[]) => {
    Log.value +=
      `[${new Date().toLocaleTimeString()}] ` + args.join(' ') + '\n';
  };
  try {
    IDB.get('TQRTData').then((res) => {
      if (res) {
        Data.value = Object.assign(Data.value, res);
      }
    });
    IDB.get('TQRTLocal').then((res) => {
      if (res) {
        Local.value = res;
      }
    });
  } catch (e) {
    console.log(e);
  }
  const save = () => {
    IDB.set('TQRTData', toRaw(Data.value));
    IDB.set('TQRTLocal', toRaw(Local.value));
  };
  const fetchData = async () => {
    const data = (await ky
      .get('https://hoyo-textmap.sharpdotnut.com/Data.json')
      .json()) as Record<'Genshin' | 'StarRail', TQRTMeta>;
    const temp: Record<string, LangData> = {};
    for (const [game, gameData] of Object.entries(data)) {
      for (const file of gameData.files) {
        const LangID = `${game}.${file.lang}`;
        if (!temp[LangID]) {
          temp[LangID] = {
            lang: file.lang,
            size: file.size,
            game: game,
            files: [file]
          };
        } else {
          temp[LangID].size += file.size;
          temp[LangID].files.push(file);
        }
      }
    }
    Data.value.langData = temp;
    Data.value.files = data.Genshin.files;
    Data.value.files.concat(data.StarRail.files);
    Data.value.meta.Genshin = data.Genshin.version;
    Data.value.meta.StarRail = data.StarRail.version;
    save();
  };
  fetchData();
  const download = async (langID: string) => {
    const data: Record<string, string> = {};
    for (const file of Data.value.langData[langID].files) {
      Downloading.value.push(file);
      file.progress = 0;
    }
    for (const file of Data.value.langData[langID].files) {
      await ky
        .get(`https://hoyo-textmap.sharpdotnut.com/${file.name}`, {
          onDownloadProgress: (progress) => {
            file.progress = progress.transferredBytes;
          }
        })
        .then(async (res) => {
          Object.assign(data, await res.json());
          Downloading.value.shift();
          logger(`File ${langID} downloaded...`);
        });
    }
    Local.value.add(langID);
    IDB.set(langID, data);
    await IDB.set('TQRTLocal', toRaw(Local.value));
    logger(`Text map ${langID} downloaded successfully`);
  };
  const search = async (
    game: string,
    text: string,
    lang: string,
    translate?: string
  ) => {
    const langId = getLangID(game, lang);
    if (!Object.keys(TextMap).includes(langId)) {
      TextMap[langId] = await IDB.get(langId);
      logger(`Text map ${langId} loaded from indexedDB`);
    }
    logger(`Searching ${text} in ${langId}...`);
    let translateId = '';
    if (translate) {
      translateId = getLangID(game, translate);
      if (!Object.keys(TextMap).includes(translateId)) {
        TextMap[translateId] = await IDB.get(translateId);
        logger(`Text map ${translateId} loaded from indexedDB`);
      }
      logger(`Translate ${text} in ${translateId}...`);
    }
    const result = [];
    console.log('k');
    for (const [key, value] of Object.entries(TextMap[langId])) {
      if (value.includes(text)) {
        result.push({
          id: key,
          text: value,
          translate:
            translate != undefined ? TextMap[translateId]?.[key] : undefined
        });
      }
    }
    return result;
  };

  return { Data, Downloading, Local, Log, fetchData, download, logger, search };
});
