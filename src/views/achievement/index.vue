<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import {
  searchAchievement,
  SearchPlatforms as D_SearchPlatform,
  parseUIAF
} from './index'
import type { t_AchievementGroup } from '@/data/achievement/types'
import { stringIndexOfIgnoreCase } from '@/script/tools'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/stores/main'

import type { t_AchievementData } from './types'
import { useRM } from '@/stores/resource-manager'

const AchievementData: Ref<t_AchievementData | null> = ref(null)
const TextMap: Ref<{
  [lang: string]: {
    [id: string]: string
  }
}> = ref({})
const { locale } = useI18n()
const f_Versions: Ref<{
  [key: string]: Array<string>
}> = ref({})
const files: Ref<
  Array<{
    file: File
  }>
> = ref([])
const ui_showArchive = ref(false)

const RM = useRM()
RM.check()
RM.get('achievement/meta').then(async (data) => {
  AchievementData.value = data
  DataLoaded()
  search()
})
function DataLoaded(UIAf?: any) {
  if (!AchievementData.value) return
  if (UIAf) parseUIAF(UIAf, AchievementData.value)
  f_Versions.value = { '-1': AchievementData.value.versions }
  for (const goal of AchievementData.value.data) {
    f_Versions.value[goal.order - 1] = goal.versions
  }
}
function loadTextMap() {
  RM.get('achievement/text-map', locale.value).then(async (data) => {
    TextMap.value[locale.value] = data
  })
}
loadTextMap()
watch(locale, () => {
  loadTextMap()
})

const f_selectedGoal = ref(-1)
const f_searchPlatform = ref('miyoushe')
const f_search = ref({
  text: '',
  version: 'all',
  finished: 'all'
})
watch(f_selectedGoal, () => {
  f_search.value.version = 'all'
})
const ui_SearchedAchievementList: Ref<t_AchievementGroup[]> = ref([])
function search() {
  if (!AchievementData.value) return
  let data: Array<any> = []
  if (f_selectedGoal.value == -1) {
    for (const goal of AchievementData.value.data) {
      data = data.concat(goal.achievementGroups)
    }
  } else {
    data = AchievementData.value.data[f_selectedGoal.value].achievementGroups
  }
  data = data.filter((achievements: t_AchievementGroup) => {
    let _version = true
    let _text = false
    if (!(f_search.value.version == 'all')) {
      if (!(achievements.version == f_search.value.version)) {
        _version = false
      }
    }
    if (f_search.value.text == '') {
      _text = true
    } else if (
      stringIndexOfIgnoreCase(
        TextMap.value[locale.value][achievements.name],
        f_search.value.text
      )
    ) {
      _text = true
    } else
      for (const achievement of achievements.achievements) {
        if (
          stringIndexOfIgnoreCase(
            TextMap.value[locale.value][achievement.description],
            f_search.value.text
          )
        ) {
          _text = true
        }
      }
    return _version && _text
  })
  ui_SearchedAchievementList.value = data
}
watch(
  [
    () => f_search.value.version,
    () => f_search.value.text,
    () => f_selectedGoal.value
  ],
  () => {
    search()
  }
)

function loadUIAF() {
  const file = files.value[0].file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      DataLoaded(JSON.parse(e?.target?.result as any))
      search()
    }
    reader.readAsText(file)
  }
}
</script>

<template>
  <div
    v-if="AchievementData == null || TextMap[locale] == null"
    class="__container">
    <var-loading :description="$t('global.loading')"></var-loading>
  </div>
  <div v-else class="__container">
    <var-paper id="bar">
      <div id="form">
        <var-input
          variant="outlined"
          v-model="f_search.text"
          :placeholder="$t('achievement.search')"
          clearable></var-input>
        <br />
        <div style="display: flex; width: 100%; gap: 1em">
          <var-select
            style="flex: 1"
            :disabled="
              f_selectedGoal != -1 && f_Versions[f_selectedGoal].length == 1
            "
            variant="outlined"
            v-model="f_search.version"
            :placeholder="$t('achievement.select-version')">
            <var-option
              :value="'all'"
              :label="$t('achievement.all')"></var-option>
            <var-option
              v-for="version in f_Versions[f_selectedGoal]"
              :value="version"
              :label="version"></var-option>
          </var-select>
          <var-select
            disabled
            style="flex: 1"
            variant="outlined"
            v-model="f_search.finished"
            :placeholder="$t('achievement.finish.is-finished')">
            <var-option
              :value="'all'"
              :label="$t('achievement.all')"></var-option>
            <var-option
              :value="'unfinished'"
              :label="$t('achievement.finish.unfinished')"></var-option>
            <var-option
              :value="'unfinished'"
              :label="$t('achievement.finish.finished')"></var-option>
          </var-select>
        </div>
        <br />
        <var-select
          variant="outlined"
          v-model="f_searchPlatform"
          :placeholder="$t('achievement.platforms-to-search')">
          <var-option
            v-for="(value, key) in D_SearchPlatform"
            :value="key"
            :label="value.name"></var-option>
        </var-select>
        <br />
        <var-button block type="primary" @click="ui_showArchive = true">
          {{ $t('achievement.import-export') }}
        </var-button>
        <var-dialog v-model:show="ui_showArchive">
          <template #title>{{ $t('achievement.import-export') }}</template>
          <var-uploader v-model="files" accept=".json" @after-read="loadUIAF" />
        </var-dialog>
      </div>
      <br />
      <div id="goal-list">
        <var-cell
          :class="{ selected: f_selectedGoal === -1 }"
          border
          :value="-1"
          ripple
          @click="f_selectedGoal = -1">
          <p style="font-size: 120%">{{ $t('achievement.all') }}</p>
          <p>
            {{
              $t('achievement.numbers', [
                AchievementData.numberOfGroups,
                AchievementData.numberOfAchievements
              ])
            }}
          </p>
          <p></p>
        </var-cell>
        <var-cell
          border
          ripple
          v-for="(goal, index) in AchievementData.data"
          :class="{ selected: f_selectedGoal === index }"
          @click="f_selectedGoal = goal.order - 1">
          <p style="font-size: 120%">{{ TextMap[locale][goal.name] }}</p>
          <p>
            {{
              $t('achievement.numbers', [
                goal.numberOfGroups,
                goal.numberOfAchievements
              ])
            }}
          </p>
        </var-cell>
      </div>
    </var-paper>
    <dynamic-scroller
      id="achievements"
      :items="ui_SearchedAchievementList"
      :min-item-size="122"
      key-field="name">
      <template #default="{ item: group, index, active }">
        <dynamic-scroller-item
          :item="group"
          :active="active"
          :size-dependencies="[group.achievements, group.progress]"
          :data-index="index">
          <div class="item">
            <var-card>
              <h2>
                {{ TextMap[locale][group.name] }}
                <var-chip size="small" type="info">
                  {{ group.version }}
                </var-chip>
                <span>&nbsp;</span>
                <var-chip size="small" type="info" v-if="group?.status">
                  {{ $t('achievement.status.' + group?.status) }}
                </var-chip>
              </h2>
              <br />
              <div
                v-for="(achievement, aIndex) in group.achievements"
                :key="aIndex">
                <p
                  :style="{
                    textDecoration:
                      group?.progress &&
                      group.status != 0 &&
                      group.progress.current / achievement.progress >= 1
                        ? 'line-through'
                        : 'none'
                  }">
                  <span>
                    {{ achievement.rewards }}
                    <img style="height: 1em" src="./img/Primo.webp" />
                  </span>
                  {{ TextMap[locale][achievement.description] }}
                  <var-chip size="mini" type="info">
                    ID {{ achievement.id }}
                  </var-chip>
                </p>
                <div
                  v-if="
                    group?.progress &&
                    group.status != 0 &&
                    group.status != 2 &&
                    group.finalProgress != 1
                  ">
                  <var-progress
                    label
                    type="success"
                    :value="
                      (group.progress.current / achievement.progress) * 100
                    " />
                </div>
              </div>
              <div
                v-if="
                  group?.progress &&
                  group.status != 0 &&
                  group.finalProgress != 1
                ">
                完成次数 {{ group.progress.current }}
              </div>
              <var-space justify="flex-end">
                <var-button
                  @click="
                    searchAchievement(
                      TextMap[locale][group.name],
                      f_searchPlatform
                    )
                  ">
                  {{
                    $t(
                      'achievement.search-with',
                      //@ts-ignore
                      [D_SearchPlatform[f_searchPlatform].name]
                    )
                  }}
                </var-button>
              </var-space>
            </var-card>
          </div>
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
