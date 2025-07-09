import path from 'node:path';
import fs from 'node:fs/promises';

const dirname = import.meta.dirname;

async function processJsonFiles() {
  try {
    const files = await fs.readdir(path.join(dirname, '../src/locales'));

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(dirname, '../src/locales', file);
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        const sorted = Object.entries(data).sort((a, b) =>
          a[0].localeCompare(b[0])
        );
        await fs.writeFile(
          filePath,
          JSON.stringify(Object.fromEntries(sorted), null, 2)
        );
        console.log(`Sorted locale ${file}`);
      }
    }
  } catch (err) {
    console.error('Error processing JSON files:', err);
  }
}

processJsonFiles();
