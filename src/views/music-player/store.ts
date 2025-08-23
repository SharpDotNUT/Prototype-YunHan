import ky from 'ky';
import { defineStore } from 'pinia';
import { ref, shallowRef, watch } from 'vue';
import type { T_Album, T_AlbumDetail, T_RawSong, T_Song } from './types';

export const useMusicStore = defineStore('music', () => {
  const audio = shallowRef(new Audio());
  const D_Album = ref<T_Album[]>([]);
  const D_Song = ref<T_Song[]>([]);
  const progress = ref({
    current: 0,
    duration: 0
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

  const setSong = (song: T_Song) => {
    audio.value.src = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
    audio.value.load();
  };

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
      'https://unpkg.com/@kuriyota/hoyomix-ncm@latest/data/album.json'
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

  return {
    setSong,
    setProgress,
    pause,
    progress,
    fetchAlbum,
    D_Album,
    D_Song
  };
});
