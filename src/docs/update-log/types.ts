export type t_UpdateLog = Array<{
  version: string;
  date: string;
  released?: boolean;
  zh?: string;
  en?: string;
  items: Array<{
    area: string;
    zh: string;
    en: string;
  }>;
}>;
