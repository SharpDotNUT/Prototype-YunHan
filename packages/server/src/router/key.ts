import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import fs from 'node:fs/promises';
import path from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;

const dbPath = path.join(process.env.DB_FILE!);
console.log(dbPath);
const db = new Database(dbPath);

const app = new Elysia({
  prefix: '/sp-keys'
});
export { app as RKeys };

app.get('/all', () => {
  const data = db.query('SELECT * FROM keys').all();
  return data;
});
app.post(
  '/add',
  async (ctx) => {
    try {
      if (!ctx.body) {
        ctx.set.status = 400;
        return 'No body';
      }
      const {
        token,
        key,
        game,
        version,
        server,
        'available-time': availableTime
      } = ctx.body;
      if (token != 'YunJinYYT0521') {
        throw new Error('Unauthorized');
      }
      const data = db
        .query(
          'INSERT INTO keys (key, game, server, version, "available-time") VALUES (?, ?, ?, ?, ?)'
        )
        .all(key, game, server, version, availableTime);
      return data;
    } catch (err) {
      ctx.set.status = 500;
      return err;
    }
  },
  {
    body: t.Object({
      token: t.String(),
      key: t.String(),
      game: t.String(),
      version: t.String(),
      server: t.String(),
      'available-time': t.Number()
    })
  }
);
