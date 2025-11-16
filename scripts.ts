import fs from 'node:fs/promises';
import path from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;

const updateVersion = async () => {
  const files = [
    './package.json',
    './packages/yunhan/package.json',
    './packages/meta/package.json',
    './packages/server/package.json'
  ];
  const version = process.argv[3];
  for (const file of files) {
    try {
      const data = await fs.readFile(file, 'utf-8');
      const json = JSON.parse(data);
      json.version = version;
      await fs.writeFile(file, JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
};

switch (process.argv[2]) {
  case 'version':
    updateVersion();
}
