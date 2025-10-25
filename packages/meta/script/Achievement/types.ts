export interface RawAchievement {
  id: number;
  titleTextMapHash: number;
  descTextMapHash: number;
  goalId: number;
  finishRewardId: number;
  progress: number;
  preStageAchievementId: number | 0;
  isDeleteWatcherAfterFinish: boolean;
}

export interface RawAchievementGoal {
  finishRewardId: number;
  iconPath: string;
  id: number;
  nameTextMapHash: number;
  orderId: number;
}

export interface RawReward {
  rewardId: number;
  rewardItemList: {
    itemCount: number;
    itemId: 201;
  }[];
}

export interface Achievement {
  id: number;
  nameHash: number;
  descriptionHash: number;
  progress: number;
  reward: number;
}

export interface AchievementGroup {
  achievements: string[]; // ids
  showCount: boolean;
  finalProgress: number;
  rewardCount: number;
}

export interface AchievementGoal {
  id: number;
  order: number;
  nameHash: number;
  rewardCount: number;
  achievementsCount: number;
  groupsCount: number;
  achievementGroups: string[]; //ids
}

export interface AchievementStruct {
  rewardCount: number;
  achievementsCount: number;
  groupsCount: number;
  goalsCount: number;
  goals: string[]; //ids
}

export interface AchievementData {
  achievements: Record<string, Achievement>;
  achievementsGoals: Record<string, AchievementGoal>;
  achievementsGroups: Record<string, AchievementGroup>;
  achievementsStruct: AchievementStruct;
}
