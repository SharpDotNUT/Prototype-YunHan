export interface T_Album {
  date: number;
  name: string;
  id: number;
  alias?: string;
  cover: string;
  count: number;
  duration: number;
}

export interface T_RawSong {
  name: string;
  id: number;
  alias?: string;
  duration: number;
}

export interface T_Song extends T_RawSong {
  albumId: number;
}

export interface T_AlbumDetail extends T_Album {
  description: string;
  songs: T_Song[];
}
