import fs from 'node:fs/promises';
import path from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;
import { getText, ResDir, SupportedLanguages, writeRes } from '../utils.ts';

const Data = (
  await import('../../source/ExcelBinOutput/EmojiDataExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;
const SetData = (
  await import('../../source/ExcelBinOutput/EmojiSetDataExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;

const data = {
  data: Data,
  set: SetData
};

const ids = new Array<number>();
for (const i in Data) {
  ids.push(Data[i].contentTextMapHash);
}
for (const i in SetData) {
  ids.push(SetData[i].nameTextMapHash);
}

await fs.mkdir(path.join(ResDir, 'emotion'), { recursive: true });
writeRes('emotion/meta', data);
for (const lang of SupportedLanguages) {
  const map = {} as Record<number, string>;
  for (const id of ids) {
    map[id] = await getText(id, lang.name);
  }
  await writeRes('emotion/text_' + lang.lang, map);
}
