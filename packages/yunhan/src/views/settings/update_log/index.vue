<template>
  <div class="update-log-container">
    <div class="list">
      <var-alert type="warning">
        「更新日志」正在重制中，2.9.0 及后续版本的更新日志目前不显示，请参见
        GitHub Release 界面的简略描述。
        <br />
        "Update Log" is being rebuilt, and the update logs for versions 2.9.0
        and later will not be displayed. Please refer to the brief description
        of the GitHub Release surface.
        <br />
        「更新履歴」は現在再構築中です。2.9.0
        以降のバージョンの更新履歴は現在表示されません。GitHub
        リリースページの簡易説明をご参照ください。
      </var-alert>
      <template v-if="UpdateLogsData.length > 0">
        <var-card
          v-for="[version, info] in UpdateLogsData"
          :key="version"
          class="version">
          <div class="version-content">
            <h1>
              <span style="font-family: JetBrains Mono">
                {{ version }}
              </span>
              <span v-if="info['name-zh']" lang="zh-Hans">
                &nbsp- {{ info['name-zh'] }} {{ info['name-en'] }}
              </span>
            </h1>
            <var-divider />
            <div>
              <div
                v-for="(item, area) in info.changes"
                :key="area"
                class="change-item">
                <div class="change-meta">
                  <var-chip size="small" type="primary" class="area">
                    {{ $t('update-log.area') }} :
                    {{ getArea(area as string) }}
                  </var-chip>
                </div>
                <div class="change-content">
                  <p lang="zh-Hans" v-for="i in item.length / 2">
                    <span>{{ item[i * 2 - 2] }}</span>
                    <br />
                    <span>{{ item[i * 2 - 1] }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </var-card>
      </template>
      <div v-else class="no-results">No results found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import UpdateLogsDataText from '@/docs/update-log.yaml';
import type { I_UpdateLog } from '@/docs/update-log';
import { watch } from 'vue';

const UpdateLogsData = Object.entries(UpdateLogsDataText as I_UpdateLog);

const { locale, t } = useI18n();

const formatDate = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
};

const areas: Ref<any> = ref({});
watch(
  locale,
  () => {
    areas.value = {
      app: t('name'),
      i18n: t('update-log.areas.i18n'),
      rm: t('setting.rm'),
      about: t('setting.about'),
      intro: t('index.title'),
      'update-log': t('setting.update-log')
    };
  },
  { immediate: true }
);
function getArea(key: string) {
  if (areas.value[key]) {
    return areas.value[key];
  } else {
    return t(key + '.title');
  }
}
</script>

<style scoped>
@import url('./index.css');
</style>
