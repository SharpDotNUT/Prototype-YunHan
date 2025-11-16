import { Elysia } from 'elysia';
import { RKeys } from './router/key.ts';
import { cors } from '@elysiajs/cors';
import { RHoyoData } from './router/hoyo_data.ts';

const app = new Elysia();

app.get('/', () => 'Hello TruE Elysia!');

app.use(
  cors({
    origin: [
      'https://yunhan.sharpdotnut.com',
      'https://yunhan-dev.sharpdotnut.com',
      /^http:\/\/localhost:\d+$/
    ]
  })
);
app.use(RKeys);
app.use(RHoyoData);

app.listen(52101);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
