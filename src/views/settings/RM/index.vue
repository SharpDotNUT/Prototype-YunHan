<script setup lang="ts">
import type { Ref } from 'vue'
import type { CacheResourceRecord } from '@/script/RM/types'
import { useMainStore } from '@/stores/main'
import { filesize } from 'filesize'
import { ref } from 'vue'
const mainStore = useMainStore()

const StorageUsage: Ref<null | {
  total: number
  used: number
  cacheUsed: number
  resources: Record<string, CacheResourceRecord>
}> = ref(null)
function loadStorageUsage() {
  mainStore.RM.getLocalMeta().then((res) => {
    StorageUsage.value = res as {
      total: number
      used: number
      cacheUsed: number
      resources: Record<string, CacheResourceRecord>
    }
  })
}
loadStorageUsage()
</script>

<template>
  <div class="--rm" v-if="StorageUsage">
    <h2>{{ $t('setting.rm') }}</h2>
    <div>
      <var-progress :value="(StorageUsage.cacheUsed / 102400000) * 100" />
      <p>
        {{ filesize(StorageUsage.cacheUsed) }} /
        {{ filesize(102400000) }}
      </p>
    </div>
    <var-table id="table">
      <table id="table-content">
        <tbody>
          <tr v-for="value in StorageUsage?.resources">
            <td>
              {{ value.id }}
            </td>
            <td>
              {{ value.variant }}
            </td>
            <td>{{ filesize(value.size) }}</td>
            <td>{{ new Date(value.updatedAt).toLocaleString() }}</td>
            <td>
              <var-button
                size="small"
                type="warning"
                @click="
                  mainStore.RM.remove({
                    id: value.id,
                    variant: value.variant
                  }).then(() => {
                    loadStorageUsage()
                  })
                ">
                {{ $t('global.action.delete') }}
              </var-button>
            </td>
          </tr>
        </tbody>
      </table>
    </var-table>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
