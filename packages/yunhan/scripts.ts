import fs from 'node:fs/promises';
import path from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;

const addLocale = async () => {
  const lang = process.argv[3];
  const part = process.argv[4];
  const hash = process.argv[5];
  const text = process.argv[6];
  const filePath = path.join(
    dirname,
    `./src/locales/text/${lang}/${part}.json`
  );
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);
    json[hash] = text;
    await fs.writeFile(
      filePath,
      JSON.stringify(json, Object.keys(json).sort(), 2)
    );
  } catch (e) {
    console.log(e);
  }
};

switch (process.argv[2]) {
  case 'add-locale':
    addLocale();
}
