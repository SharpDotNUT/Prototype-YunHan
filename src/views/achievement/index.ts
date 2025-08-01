import type { Ref } from 'vue';
import type { t_AchievementData } from './types';

export function filterAchievements(
  achievementData: any,
  userUIAF: any,
  selectedVersion: any,
  selectedGoal: any,
  finished: any,
  searchString: any
) {
  console.clear();
  let _out = [];
  function _check(_goal: any) {
    let flag = true;
    if (searchString && _goal.name.indexOf(searchString) == -1) {
      flag = false;
      console.log('-');
    } else if (searchString && _goal.description.indexOf(searchString) == -1) {
      flag = false;
      console.log('--');
    } else if (selectedVersion != '所有' && _goal.version != selectedVersion) {
      flag = false;
      console.log('---');
    } else {
      let _flag = true;
      if (
        (finished == '已完成' && userUIAF[_goal.id].status == 0) ||
        (finished == '未完成' && userUIAF[_goal.id].status != 3)
      ) {
        _flag = false;
      } else if (finished == '所有') {
        _flag = true;
      }
      flag = _flag;
    }
    return flag;
  }
  if (selectedGoal == -1) {
    for (const _goal of achievementData.data) {
      for (const _group of _goal.achievements) {
        if (_check(_group[_group.length - 1])) {
          _out.push(_group);
        }
      }
    }
  } else {
    let _achievementsGoal = achievementData.data?.[selectedGoal]?.achievements;
    if (!_achievementsGoal) {
      return [];
    }
    _achievementsGoal.forEach((_goal: any) => {
      if (_check(_goal[_goal.length - 1])) {
        _out.push(_goal);
      }
    });
  }
  return _out;
}

export const SearchPlatforms: any = {
  bilibili: {
    name: '哔哩哔哩(Bilibili)',
    url: (name: string) => {
      return `https://search.bilibili.com/all?keyword=${'原神 成就 ' + name}`;
    }
  },
  miyoushe: {
    name: '米游社',
    url: (name: string) => {
      return `https://www.miyoushe.com/ys/search?keyword=${'成就 ' + name}`;
    }
  },
  hoyolab: {
    name: 'HoYoLab',
    url: (name: string) => {
      return `https://www.hoyolab.com/search?keyword=${'成就 ' + name}`;
    }
  },
  youtube: {
    name: 'YouTube',
    url: (name: string) => {
      return `https://www.youtube.com/results?search_query=${
        'Genshin Achievement ' + name
      }`;
    }
  }
};

export function searchAchievement(name: string, platform: string) {
  //@ts-ignore
  let url = SearchPlatforms[platform].url(name);
  window.open(url);
}

export function parseUIAF(data: any, achievementData: t_AchievementData) {
  let _out = [];
  for (const goal in achievementData.data) {
    for (const group in achievementData.data[goal].achievementGroups) {
      const _group = achievementData.data[goal].achievementGroups[group];
      const id = _group.achievements[0].id;
      const progress = data.list.find((item: any) => item.id == id);
      if (progress) {
        _out.push({
          id: id,
          name: _group.name
        });
        _group.progress = progress;
        _group.status = progress.status;
        if (progress.status == 3) {
          _group.progress.current = Math.max(
            _group.finalProgress,
            progress.current
          );
          _group.status = 2;
        }
      }
      if (!_group.status) {
        _group.status = 0;
      }
    }
  }
  console.log(_out);
}
