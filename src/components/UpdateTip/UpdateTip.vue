<script setup lang="ts">
const show = defineModel<boolean>();
const props = defineProps<{ data: any }>();
const emit = defineEmits<{
  confirm: void;
  cancel: void;
}>();
</script>

<template>
  <var-dialog
    v-model:show="show"
    @confirm="$emit('confirm')"
    @cancel="$emit('cancel')"
    :confirm-button-text="$t('app.update')">
    <template #title>
      {{ $t('app.update') }}
    </template>
    <p>
      {{ $t('app.new-version') }}
    </p>
    <p>{{ $t('global.meta.version-tag', [props.data.version]) }}</p>
    <p>
      {{
        $t('about.build-time', [
          new Date(props.data.buildTime).toLocaleString()
        ])
      }}
    </p>
  </var-dialog>
</template>
