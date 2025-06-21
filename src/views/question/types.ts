export interface t_QuestionsBankBaseInfo {
  name: string;
  author: string[];
  id: string;
  lang: string;
  description?: string;
  date?: string;
  version?: string; // 游戏版本 | Game Version
  link?: {
    [key: string]: string;
  };
}

export interface t_QuestionsBank extends t_QuestionsBankBaseInfo {
  questions: Array<t_QuestionChoice | t_QuestionJudge | t_QuestionFill>;
}

interface t_Question {
  id: number;
  question: string;
  tag?: string[];
}

export interface t_QuestionChoice extends t_Question {
  type: 'choice';
  answer: string[];
  choices: {
    [key: string]: string;
  };
}

export interface t_QuestionJudge extends t_Question {
  type: 'judge';
  answer: boolean;
}

export interface t_QuestionFill extends t_Question {
  type: 'fill';
  answer: string[];
}
