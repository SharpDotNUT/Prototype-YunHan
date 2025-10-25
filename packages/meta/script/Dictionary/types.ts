export interface MultiLanguage {
  en: string
  ja: string
  'zh-Hans': string
  'zh-Hant': string
}

export interface Word {
  id: string
  text: MultiLanguage
  note: Partial<MultiLanguage>
  variant: Partial<MultiLanguage>
  pronunciationJa: string
  pinyinZHS: Record<string, string>
  zhuyinZHT: Record<string, string>
  tags: string[]
  updatedAt: string
  createdAt: string
}
