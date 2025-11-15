import Elysia from 'elysia';
import { LRUCache } from 'lru-cache';

const ServerMap = {
  china: {
    api: 'https://hyp-api.mihoyo.com/hyp/hyp-connect/api/',
    launcherId: 'jGHBHlcOq1'
  },
  global: {
    api: 'https://sg-hyp-api.hoyoverse.com/hyp/hyp-connect/api/',
    launcherId: 'VYTpXlbWo8'
  }
};

const GameMAP = {
  bh3_cn: {
    Id: 'osvnlOc0S8',
    GameBiz: 'bh3_cn'
  },
  bh3_global: {
    Id: '5TIVvvcwtM',
    GameBiz: 'bh3_global'
  },
  hk4e_cn: {
    Id: '1Z8W5NHUQb',
    GameBiz: 'hk4e_cn'
  },
  hk4e_global: {
    Id: 'gopR6Cufr3',
    GameBiz: 'hk4e_global'
  },
  hk4e_bilibili: {
    Id: 'T2S0Gz4Dr2',
    GameBiz: 'hk4e_bilibili'
  },
  hkrpg_cn: {
    Id: '64kMb5iAWu',
    GameBiz: 'hkrpg_cn'
  },
  hkrpg_global: {
    Id: '4ziysqXOQ8',
    GameBiz: 'hkrpg_global'
  },
  hkrpg_bilibili: {
    Id: 'EdtUqXfCHh',
    GameBiz: 'hkrpg_bilibili'
  },
  nap_cn: {
    Id: 'x6znKlJ0xK',
    GameBiz: 'nap_cn'
  },
  nap_global: {
    Id: 'U5hbdsT9W7',
    GameBiz: 'nap_global'
  },
  nap_bilibili: {
    Id: 'HXAFlmYa17',
    GameBiz: 'nap_bilibili'
  }
};

const LanguageConvertor = {
  'zh-Hans': 'zh-cn',
  'zh-Hant': 'zh-tw',
  en: 'en-us',
  ja: 'ja-jp'
} as const;

type Server = keyof typeof ServerMap;
type Language = keyof typeof LanguageConvertor;
type Game = keyof typeof GameMAP;

const URLBuilder = (server: Server, lang: Language, game: Game) => {
  const url = new URL(ServerMap[server].api + 'getGameContent');
  url.searchParams.set('language', LanguageConvertor[lang]);
  url.searchParams.set('launcher_id', ServerMap[server].launcherId);
  url.searchParams.set('game_id', GameMAP[game].Id);
  return url.toString();
};

const app = new Elysia({
  prefix: '/hoyo-data'
});
export { app as RHoyoData };

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 5 // 5 minutes
});

app.get('/game-content/:server/:lang/:game', async ({ params }) => {
  const { server, lang, game } = params;
  const url = URLBuilder(server as Server, lang as Language, game as Game);
  if (cache.has(url)) {
    return cache.get(url);
  } else {
    const response = await fetch(url);
    const data = await response.json();
    cache.set(url, data);
    return data;
  }
});
