import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import fs, { writeFile } from 'node:fs/promises';
import path from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;

export const SupportedLanguages = [
  {
    name: 'CHS',
    lang: 'zh-Hans'
  },
  {
    name: 'CHT',
    lang: 'zh-Hant'
  },
  {
    name: 'EN',
    lang: 'en'
  },
  {
    name: 'JP',
    lang: 'ja'
  }
];

interface I_Meta {
  updateAt: number;
  version: string;
  res: Record<string, { hash: string; size: number }>;
}

export const ResDir = path.join(dirname, '../data');
export const Version = '6.0.2';
await fs.mkdir(ResDir, { recursive: true });
let meta: I_Meta = { updateAt: Date.now(), version: '6.0.2', res: {} };
const MetaPath = path.join(dirname, '../data/meta.json');
try {
  meta = JSON.parse(await fs.readFile(MetaPath, 'utf-8')) as I_Meta;
} catch (e) {
  await fs.writeFile(MetaPath, JSON.stringify(meta, null, 2), 'utf-8');
}

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    process.exit(1);
  }
};

const TextMapCache: Record<string, any> = {};

export const getText = async (hashes: number, lang: string) => {
  if (!TextMapCache?.[lang]) {
    console.log('Reading ' + lang + ' TextMap');
    TextMapCache[lang] = JSON.parse(
      await fs.readFile(
        path.join(dirname, `../source/TextMap/TextMap${lang}.json`),
        'utf-8'
      )
    );
  }
  return TextMapCache[lang][hashes];
};

export const writeRes = async (name: string, data: any, min = false) => {
  const fileName = name + '.json';
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(path.join(ResDir, fileName), json);
  meta.res[fileName] = {
    size: Buffer.byteLength(json),
    hash: createHash('md5').update(json).digest('hex')
  };
  if (min) {
    const fileName = name + '.min.json';
    const json = JSON.stringify(data);
    await fs.writeFile(path.join(ResDir, fileName), json);
    meta.res[fileName] = {
      size: Buffer.byteLength(json),
      hash: createHash('md5').update(json).digest('hex')
    };
  }
  writeFile(MetaPath, JSON.stringify(meta, null, 2));
  console.log(`resource ${name} done`);
};
