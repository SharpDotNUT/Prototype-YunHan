import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;

async function main0() {
  try {
    console.log('Cloning Snap.Metadata repository...');
    execSync(
      'git clone --depth=1 https://github.com/DGP-Studio/Snap.Metadata.git ./source/Snap.Metadata.temp',
      { stdio: 'inherit' }
    );

    // Move Genshin folder
    console.log('Moving Genshin folder...');
    await fs
      .access(path.join(dirname, './source/Snap.MetaData'))
      .then(async () => {
        await fs.rm(path.join(dirname, './source/Snap.MetaData'), {
          recursive: true,
          force: true
        });
      })
      .catch(() => {});
    await fs.rename(
      path.join(dirname, './source/Snap.Metadata.temp/Genshin'),
      path.join(dirname, './source/Snap.MetaData')
    );

    // Remove temp directory
    console.log('Removing temporary directory...');
    await fs.rm(path.join(dirname, './source/Snap.Metadata.temp'), {
      recursive: true,
      force: true
    });
    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}
async function main1() {
  try {
    // Download and extract TextMap
    console.log('Downloading TextMap...');
    execSync(
      'curl https://gitlab.com/Dimbreath/AnimeGameData/-/archive/master/AnimeGameData-master.zip?path=TextMap -o ./source/TextMap.zip',
      { stdio: 'inherit' }
    );

    // Download and extract ExcelBinOutput
    console.log('Downloading ExcelBinOutput...');
    execSync(
      'curl https://gitlab.com/Dimbreath/AnimeGameData/-/archive/master/AnimeGameData-master.zip?path=ExcelBinOutput -o ./source/ExcelBinOutput.zip',
      { stdio: 'inherit' }
    );

    // Extract archives
    console.log('Extracting archives...');
    execSync('7z x ./source/TextMap.zip -o./source/_TextMap', {
      stdio: 'inherit'
    });
    execSync('7z x  ./source/ExcelBinOutput.zip -o./source/_ExcelBinOutput', {
      stdio: 'inherit'
    });

    // Move extracted directories
    console.log('Moving extracted directories...');
    await fs
      .access(path.join(dirname, './source/TextMap'))
      .then(async () => {
        await fs.rm(path.join(dirname, './source/TextMap'), {
          recursive: true,
          force: true
        });
      })
      .catch(() => {});
    await fs.rename(
      path.join(dirname, './source/_TextMap/AnimeGameData-master-TextMap'),
      path.join(dirname, './source/TextMap')
    );
    await fs
      .access(path.join(dirname, './source/ExcelBinOutput'))
      .then(async () => {
        await fs.rm(path.join(dirname, './source/TextMap'), {
          recursive: true,
          force: true
        });
      })
      .catch(() => {});
    await fs.rename(
      path.join(
        dirname,
        './source/_ExcelBinOutput/AnimeGameData-master-ExcelBinOutput'
      ),
      path.join(dirname, './source/ExcelBinOutput')
    );

    // Clean up
    console.log('Cleaning up...');
    await fs.rm(path.join(dirname, './source/TextMap.zip'), { force: true });
    await fs.rm(path.join(dirname, './source/ExcelBinOutput.zip'), {
      force: true
    });
    await fs.rm(path.join(dirname, './source/_TextMap'), {
      recursive: true,
      force: true
    });
    await fs.rm(path.join(dirname, './source/_ExcelBinOutput'), {
      recursive: true,
      force: true
    });

    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

const p = process.argv[2];
if (p === '0') {
  main0();
} else if (p === '1') {
  main1();
}
