import ky from 'ky';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef, watch } from 'vue';
import {
  type T_LyricLine,
  type T_Album,
  type T_AlbumDetail,
  type T_Song
} from './types';

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds}`;
};

export const useMusicStore = defineStore('music', () => {
  const audio = shallowRef(new Audio());
  const D_Album = ref<T_Album[]>([]);
  const D_Song = ref<T_Song[]>([]);
  const progress = ref({
    current: 0,
    duration: 0
  });

  audio.value.addEventListener('canplay', () => {
    audio.value.play();
  });
  audio.value.addEventListener('loadedmetadata', () => {
    progress.value.duration = audio.value.duration;
  });
  audio.value.addEventListener('timeupdate', () => {
    progress.value.current = audio.value.currentTime;
  });
  audio.value.addEventListener('play', () => {
    pause.value = false;
  });
  audio.value.addEventListener('pause', () => {
    pause.value = true;
  });

  const current = ref<T_Song>();
  const currentAlbumID = ref<number>();
  watch(current, (song) => {
    if (!song) return;
    audio.value.src = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
    audio.value.load();
    ky(
      `https://unpkg.com/@kuriyota/hoyomix-ncm@latest/data/lyrics/${song.id}.json`
    ).then(async (res) => {
      lyric.value = await res.json();
    });
  });

  const lyric = ref<T_LyricLine[]>([]);
  const currentLyricIndex = computed(() => {
    const nextIndex = lyric.value.findIndex(
      (line) => line.time >= progress.value.current * 1000
    );
    return nextIndex > 0 ? nextIndex - 1 : 0;
  });

  const pause = ref(true);
  watch(pause, () => {
    if (pause.value) {
      audio.value.pause();
    } else {
      audio.value.play();
    }
  });

  const setProgress = (progress: number) => {
    audio.value.currentTime = progress;
  };

  const fetchAlbumMeta = async () => {
    const res = await ky(
      'https://unpkg.com/@kuriyota/hoyomix-ncm@latest/data/albums.json',
      { cache: 'no-store' }
    );
    const data = (await res.json()) as T_Album[];
    D_Album.value = data;
  };
  fetchAlbumMeta();

  const albumLoaded = new Set<number>();
  const fetchAlbum = async (id: number) => {
    if (albumLoaded.has(id)) return;
    const res = await ky(
      `https://unpkg.com/@kuriyota/hoyomix-ncm@latest/data/albums/${id}.json`
    );
    const data = ((await res.json()) as T_AlbumDetail).songs.map((song) => {
      return {
        ...song,
        albumId: id
      };
    });
    D_Song.value.push(...data);
    albumLoaded.add(id);
  };
  fetchAlbum(195683561).then(() => {
    currentAlbumID.value = 195683561;
    current.value = D_Song.value.find((song) => song.id === 2155423467);
  });

  const getCover = (id: number | undefined, high: boolean = false) => {
    if (!id) return '';
    const album = D_Album.value.find((a) => a.id === id);
    if (!album) return '';
    return `https://p1.music.126.net/${album.cover}${high ? '' : '?param=100y100'}`;
  };

  return {
    current,
    setProgress,
    lyric,
    currentLyricIndex,
    pause,
    progress,
    fetchAlbum,
    currentAlbumID,
    D_Album,
    D_Song,
    getCover
  };
});
