<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { round } from 'lodash-es'
import { getTable, type GachaType, type Games } from 'hoyo-gacha'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useMainStore } from '@/stores/main'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const mainStore = useMainStore()

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const table = computed(() => getTable(game.value, type.value, rank.value))

const game = ref<Games>('GI')
const type = ref<GachaType>('Character')
const rank = ref<4 | 5>(5)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: [t('gacha.data.single-proba'), t('gacha.data.cumulative-proba')]
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: table.value.table.map((item) => item.count)
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
  },
  series: [
    {
      name: t('gacha.data.single-proba'),
      type: 'line',
      data: table.value.table.map((item) => round(item.probability / 10, 2))
    },
    {
      name: t('gacha.data.cumulative-proba'),
      type: 'line',
      data: table.value.table.map((item) => round(item.hasGot * 100, 6))
    }
  ]
}))
</script>

<template>
  <div class="container-gacha-data">
    <div id="select">
      <var-tabs v-model:active="game">
        <var-tab name="GI">
          {{ $t('global.game.GI') }}
        </var-tab>
        <var-tab name="HSR">
          {{ $t('global.game.HSR') }}
        </var-tab>
        <var-tab name="ZZZ">
          {{ $t('global.game.ZZZ') }}
        </var-tab>
      </var-tabs>
      <var-tabs v-model:active="type">
        <var-tab name="Character">{{ $t('global.character') }}</var-tab>
        <var-tab name="Weapon">{{ $t('global.weapon') }}</var-tab>
      </var-tabs>
      <var-tabs v-model:active="rank">
        <var-tab :name="5">{{ $t('global.5-star') }}</var-tab>
        <var-tab :name="4">{{ $t('global.4-star') }}</var-tab>
      </var-tabs>
    </div>
    <v-chart
      class="chart"
      :option="chartOption"
      :theme="mainStore.theme"
      autoresize />
    <var-table style="height: 90vh">
      <thead>
        <tr>
          <th>{{ $t('gacha.data.count') }}</th>
          <th>{{ $t('global.probability') }}</th>
          <th>{{ $t('gacha.data.get-this') }}</th>
          <th>{{ $t('gacha.data.get-all') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in table.table" :key="index">
          <td>{{ item.count }}</td>
          <td>{{ round(item.probability / 10, 2) }}%</td>
          <td>{{ round(item.got * 100, 6) }}%</td>
          <td>{{ round(item.hasGot * 100, 6) }}%</td>
        </tr>
      </tbody>
    </var-table>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
.chart {
  height: 400px;
  width: 100%;
}
</style>
