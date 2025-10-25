import fs, { mkdir } from 'node:fs/promises';
import path, { join } from 'node:path';
import { convertGIFormat } from './convert.ts';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;
import { ResDir, writeRes } from '../utils.ts';

let data: any = {};

if (process.argv[2] === 'fetch') {
  const res = await fetch('https://dataset.genshin-dictionary.com/words.json');
  const json = await res.json();
  data = json;
  await fs.writeFile(
    path.join(dirname, 'genshin.temp.json'),
    JSON.stringify(json, null, 2),
    'utf-8'
  );
} else {
  data = JSON.parse(
    await fs.readFile(path.join(dirname, './genshin.temp.json'), 'utf-8')
  );
}

data = convertGIFormat(data);

const tags = JSON.parse(
  await fs.readFile(path.join(dirname, './tags.json'), 'utf-8')
);

await mkdir(join(ResDir, 'dictionary'), { recursive: true });
await writeRes('dictionary/genshin', data, true);
await writeRes('dictionary/genshin-tags', tags);

console.log('Dictionary updated');
