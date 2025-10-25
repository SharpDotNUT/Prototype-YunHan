import fs from 'node:fs/promises';
import path from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;
import { getText, ResDir, SupportedLanguages, writeRes } from '../utils.ts';

const Avatar = (
  await import('../../source/ExcelBinOutput/AvatarExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;
const Weapon = (
  await import('../../source/ExcelBinOutput/WeaponExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;

const CharactersIDs: Record<number, number> = {};
Avatar.forEach((avatar) => {
  CharactersIDs[avatar.id] = avatar.nameTextMapHash;
});
const WeaponIDs: Record<number, number> = {};
Weapon.forEach((weapon) => {
  WeaponIDs[weapon.id] = weapon.nameTextMapHash;
});
await fs.mkdir(path.join(ResDir, 'id-map'), { recursive: true });
for (const lang of SupportedLanguages) {
  const ids = { ...CharactersIDs, ...WeaponIDs };
  const map = {} as Record<number, string>;
  for (const id in ids) {
    map[id] = await getText(ids[id], lang.name);
  }
  await writeRes('id-map/id-map_' + lang.lang, map);
}
