import fs from 'node:fs';
import path from 'node:path';
import { ResDir, SupportedLanguages, writeRes } from '../utils.ts';
import { mkdir } from 'node:fs/promises';
import { PoolData, PoolStruct } from './types.ts';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;

await mkdir(path.join(ResDir, 'gacha'), { recursive: true });

const baseLang = SupportedLanguages[0];
const baseData = JSON.parse(
  fs.readFileSync(
    path.join(
      dirname,
      `../../source/Snap.MetaData/${baseLang.name}/GachaEvent.json`
    ),
    'utf-8'
  )
);

const poolData = {} as Record<string, PoolData>;
const poolStruct = {} as PoolStruct;
for (const item of baseData) {
  const key = `${item.Version}-${item.Order}-${item.Type}`;
  const pool = {
    name: `T-${key}`,
    img: `I-${key}`,
    order: item.Order,
    type: item.Type,
    star5: item.UpOrangeList,
    star4: item.UpPurpleList,
    from: item.From,
    to: item.To
  };

  poolData[key] = pool;
  poolStruct[item.Version] ??= {};
  poolStruct[item.Version][item.Order] ??= [];
  poolStruct[item.Version][item.Order].push(key);
}
await writeRes('gacha/pool', { poolData, poolStruct }, true);

for (const lang of SupportedLanguages) {
  const textMap = {} as Record<string, string>;
  const langData = JSON.parse(
    fs.readFileSync(
      path.join(
        dirname,
        `../../source/Snap.MetaData/${lang.name}/GachaEvent.json`
      ),
      'utf-8'
    )
  );

  for (const item of langData) {
    const key = `${item.Version}-${item.Order}-${item.Type}`;
    textMap[`T-${key}`] = item.Name;
    textMap[`I-${key}`] = item.Banner;
  }
  await writeRes(`gacha/text_map_${lang.lang}`, textMap);
}
