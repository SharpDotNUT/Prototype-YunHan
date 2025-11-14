<script setup lang="ts">
import type { Ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { filesize } from 'filesize';
import { ref } from 'vue';
import { useRM, type I_CacheResourceRecord } from '@/stores/resource-manager';
const mainStore = useMainStore();

const StorageUsage: Ref<null | {
  total: number | undefined;
  used: number | undefined;
  cacheUsed: number;
  resources: {
    [k: string]: I_CacheResourceRecord;
  };
}> = ref(null);
const RM = useRM();
function loadStorageUsage() {
  RM.getLocalMeta().then((res) => {
    StorageUsage.value = res;
  });
}
loadStorageUsage();
</script>

<template>
  <div class="--rm" v-if="StorageUsage">
    <h2>{{ $t('setting.rm') }}</h2>
    <div>
      <var-progress
        :value="(StorageUsage.cacheUsed / (StorageUsage.total ?? 0)) * 100" />
      <p style="display: flex; justify-content: space-between; margin-top: 5px">
        <span>{{ filesize(StorageUsage.cacheUsed) }}</span>
        <span>
          {{
            StorageUsage.total
              ? filesize(StorageUsage.total)
              : $t('global.unknown')
          }}
        </span>
      </p>
    </div>
    <var-table id="table">
      <table id="table-content">
        <tbody>
          <tr v-for="(value, key) in StorageUsage?.resources">
            <td>
              {{ key }}
            </td>
            <td>{{ filesize(value.size) }}</td>
            <td>
              <var-button
                size="small"
                type="warning"
                @click="
                  RM.removeByKey(key as string).then(() => {
                    loadStorageUsage();
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
