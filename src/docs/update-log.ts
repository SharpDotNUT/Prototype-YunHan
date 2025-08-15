export interface I_UpdateLog {
  [version: string]: {
    date: Date;
    'name-zh'?: string;
    'name-en'?: string;
    changes: {
      [area: string]: string[];
    };
  };
}
