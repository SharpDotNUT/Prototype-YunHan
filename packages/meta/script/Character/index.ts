import { join } from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;
import { ResDir, writeRes } from '../utils.ts';
import { mkdir, writeFile } from 'node:fs/promises';

const Avatar = (
  await import('../../source/ExcelBinOutput/AvatarExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;
const Fetter = (
  await import('../../source/ExcelBinOutput/FetterInfoExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;

const data: Record<number, any> = {};
Avatar.forEach((avatar) => {
  if (avatar.useType != 'AVATAR_FORMAL' || avatar.id > 10000900) return;
  const fetter = Fetter.find((fetter) => fetter.avatarId == avatar.id);
  const birth = [fetter?.infoBirthMonth, fetter?.infoBirthDay];
  data[avatar.id] = {
    birth,
    icon: avatar.iconName
  };
});

mkdir(join(ResDir, 'character'), { recursive: true });
await writeRes('character/meta', data);
