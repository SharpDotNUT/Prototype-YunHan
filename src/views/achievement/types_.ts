export interface t_Achievement {
  id: number;
  description: string;
  rewards: number;
  progress: number;
}

export interface t_AchievementGroup {
  name: string;
  version: string;
  achievements: t_Achievement[];
  id: number;
  status?: number;
  progress?: any;
  finalProgress: number;
}

export interface t_AchievementGoal {
  order: number;
  name: string;
  versions: string[];
  achievementGroups: t_AchievementGroup[];
  numberOfGroups: number;
  numberOfAchievements: number;
}

export interface t_AchievementData {
  versions: string[];
  data: t_AchievementGoal[];
  numberOfGroups: number;
  numberOfAchievements: number;
}

export type t_TextMap = {
  [lang: string]: {
    [id: string]: string;
  };
};
