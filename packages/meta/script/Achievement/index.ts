import { join } from 'node:path';
const dirname = import.meta.dirname as string;
const filename = import.meta.filename as string;
import { getText, ResDir, SupportedLanguages, writeRes } from '../utils.ts';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  Achievement,
  AchievementGoal,
  AchievementGroup,
  RawAchievement,
  RawAchievementGoal,
  AchievementStruct,
  RawReward
} from './types.ts';

let __debug = 0;
const textHashes: number[] = [];

const RawAchievement = (
  await import('../../source/ExcelBinOutput/AchievementExcelConfigData.json', {
    with: { type: 'json' }
  })
).default.filter((ach) => !ach.isDisuse);
const RawGoal = (
  await import(
    '../../source/ExcelBinOutput/AchievementGoalExcelConfigData.json',
    {
      with: { type: 'json' }
    }
  )
).default;
const Reward = (
  await import('../../source/ExcelBinOutput/RewardExcelConfigData.json', {
    with: { type: 'json' }
  })
).default;

// 构建成就映射
const achievementMap = new Map<number, RawAchievement>();
for (const ach of RawAchievement) {
  achievementMap.set(ach.id, ach);
}

// 构建目标映射
const goalMap = new Map<number, RawAchievementGoal>();
for (const goal of RawGoal) {
  goalMap.set(goal.id, goal);
}

// 构建奖励映射
const rewardMap = new Map<number, RawReward>();
for (const reward of Reward as RawReward[]) {
  rewardMap.set(reward.rewardId, reward);
}

// 按目标ID分类成就
const achievementsByGoal = new Map<number, RawAchievement[]>();
for (const ach of RawAchievement) {
  if (!achievementsByGoal.has(ach.goalId)) {
    achievementsByGoal.set(ach.goalId, []);
  }
  achievementsByGoal.get(ach.goalId)?.push(ach);
}

// 修复1: 正确构建成就组链
const successorMap = new Map<number, number>();
for (const ach of RawAchievement) {
  if (
    ach.preStageAchievementId !== 0 &&
    achievementMap.has(ach.preStageAchievementId)
  ) {
    successorMap.set(ach.preStageAchievementId, ach.id);
  }
}

// 处理成就分组
const achievementGroups: Record<string, AchievementGroup> = {};
const groupsByGoal = new Map<number, AchievementGroup[]>();
const visited = new Set<number>();

for (const ach of RawAchievement) {
  if (visited.has(ach.id)) continue;

  // 找到链的起点 (没有前置成就的成就)
  let currentId = ach.id;
  while (true) {
    const currentAch = achievementMap.get(currentId)!;
    if (
      currentAch.preStageAchievementId === 0 ||
      !achievementMap.has(currentAch.preStageAchievementId)
    ) {
      break;
    }
    currentId = currentAch.preStageAchievementId;
  }

  // 遍历整个成就链
  const groupAchievements: string[] = [];
  let groupReward = 0;
  let currentInChain: number | undefined = currentId;
  let finalProgress = 0;
  let showCount = false;

  while (currentInChain && achievementMap.has(currentInChain)) {
    const chainAch = achievementMap.get(currentInChain)!;
    visited.add(chainAch.id);
    groupAchievements.push(chainAch.id.toString());

    // 计算奖励
    const reward = rewardMap.get(chainAch.finishRewardId);
    if (reward?.rewardItemList) {
      const primogem = reward.rewardItemList.find(
        (item) => item.itemId === 201
      )!;
      groupReward += primogem.itemCount;
      __debug += primogem.itemCount; // 同步到调试计数器
    }

    // 使用链中第一个成就的showCount
    if (groupAchievements.length === 1) {
      showCount = chainAch.isDeleteWatcherAfterFinish;
    }

    finalProgress = chainAch.progress;
    currentInChain = successorMap.get(chainAch.id);
  }

  const group: AchievementGroup = {
    achievements: groupAchievements,
    showCount: showCount,
    finalProgress,
    rewardCount: groupReward
  };

  achievementGroups[group.achievements[0]] = group;

  // 按目标ID分组
  const goalId = achievementMap.get(currentId)!.goalId;
  if (!groupsByGoal.has(goalId)) {
    groupsByGoal.set(goalId, []);
  }
  groupsByGoal.get(goalId)!.push(group);
}

// 构建成就目标
const achievementGoals: Record<number, AchievementGoal> = {};
let totalRewards = 0;

for (const goal of RawGoal) {
  const goalId = goal.id;
  const goalGroups = groupsByGoal.get(goalId) || [];
  let goalReward = 0;
  let achievementsCount = 0;

  goalGroups.forEach((group) => {
    goalReward += group.rewardCount;
    achievementsCount += group.achievements.length;
  });

  totalRewards += goalReward;

  textHashes.push(goal.nameTextMapHash);
  achievementGoals[goalId] = {
    id: goalId,
    order: goal.orderId,
    nameHash: goal.nameTextMapHash,
    rewardCount: goalReward,
    achievementsCount,
    groupsCount: goalGroups.length,
    achievementGroups: goalGroups.map((g) => g.achievements[0])
  };
}

// 构建成就结构统计
const achievementStruct: AchievementStruct = {
  rewardCount: totalRewards,
  achievementsCount: RawAchievement.length,
  groupsCount: Object.keys(achievementGroups).length,
  goalsCount: RawGoal.length,
  goals: Object.keys(achievementGroups)
};

// 生成成就数组
const achievements: Record<string, Achievement> = {};
RawAchievement.map((ach) => {
  let rewardAmount = 0;
  const reward = rewardMap.get(ach.finishRewardId);
  if (reward?.rewardItemList) {
    const primogem = reward.rewardItemList.find((item) => item.itemId === 201)!;
    rewardAmount = primogem.itemCount;
  }
  textHashes.push(ach.titleTextMapHash);
  textHashes.push(ach.descTextMapHash);
  achievements[ach.id] = {
    id: ach.id,
    nameHash: ach.titleTextMapHash,
    descriptionHash: ach.descTextMapHash,
    progress: ach.progress,
    reward: rewardAmount
  };
});

await mkdir(join(ResDir, 'achievement'), { recursive: true });
await writeRes(
  'achievement/meta',
  {
    achievements,
    achievementGroups,
    achievementGoals,
    achievementStruct
  },
  true
);
SupportedLanguages.map(async (lang) => {
  const map = {} as Record<number, string>;
  for (const hash of textHashes) {
    map[hash] = await getText(hash, lang.name);
  }
  await writeRes(`achievement/text_${lang.lang}`, map);
});
