<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="container">
    <p lang="zh-Hans">此功能已暂时停用</p>
    <p lang="en">This function is temporarily disabled</p>
    <p lang="ja">この機能は一時的に停止されています</p>
    <var-divider />
    <router-link to="/">
      <var-button lang="zh-Hans">
        {{ $t('home.title') }}
      </var-button>
    </router-link>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
