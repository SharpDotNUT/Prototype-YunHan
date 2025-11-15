export interface I_GameContent {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  content: Content;
}

export interface Content {
  game: Game;
  language: string;
  banners: Banner[];
  posts: Post[];
  social_media_list: SocialMediaList[];
}

export interface Banner {
  id: string;
  image: Image;
  i18n_identifier: string;
}

export interface Image {
  url: string;
  link: string;
  login_state_in_link: boolean;
}

export interface Game {
  id: string;
  biz: string;
}

export interface Post {
  id: string;
  type: 'POST_TYPE_ACTIVITY' | 'POST_TYPE_ANNOUNCE' | 'POST_TYPE_INFO';
  title: string;
  link: string;
  date: string;
  login_state_in_link: boolean;
  i18n_identifier: string;
}

export interface SocialMediaList {
  id: string;
  icon: Icon;
  qr_image: Image;
  qr_desc: string;
  links: Link[];
  enable_red_dot: boolean;
  red_dot_content: string;
}

export interface Icon {
  url: string;
  hover_url: string;
  link: string;
  login_state_in_link: boolean;
  md5: string;
  size: number;
}

export interface Link {
  title: string;
  link: string;
  login_state_in_link: boolean;
}
