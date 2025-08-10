import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';

interface ExtraFile {
  path: string;
  content: string | Uint8Array;
  headers?: Headers;
}

export function createExtraFilesPlugin(extraFiles: ExtraFile[]): Plugin {
  return {
    name: 'vite-plugin-extra-files',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0].split('#')[0];
        if (!url) return next();
        const matchedFile = extraFiles.find((file) => file.path === url);
        if (!matchedFile) return next();
        try {
          if (matchedFile.headers) {
            Object.entries(matchedFile.headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });
          }
          res.end(matchedFile.content);
          console.log(`[extra-files] Served: ${url}`);
        } catch (error) {
          console.error(`[extra-files] Error serving ${url}:`, error);
          next(error);
        }
      });
    },

    // 生产构建文件写入
    async writeBundle(options) {
      const outDir = options.dir || 'dist';

      for (const file of extraFiles) {
        try {
          const outputPath = path.join(outDir, file.path);
          const dir = path.dirname(outputPath);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(
            outputPath,
            file.content,
            typeof file.content === 'string' ? 'utf8' : undefined
          );
          console.log(`[extra-files] Created: ${file.path}`);
        } catch (error) {
          console.error(`[extra-files] Error creating ${file.path}:`, error);
          throw error;
        }
      }
    }
  };
}
