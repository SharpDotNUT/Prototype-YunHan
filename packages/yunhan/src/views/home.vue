<script setup lang="ts">
//@ts-ignore
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NavigationData } from '@/nav';
</script>

<template>
  <div class="home-container">
    <img
      src="https://yunhan-data.sharpdotnut.com/Static/Genshin-UI/UI_Download_Bg.png" />
    <main>
      <p v-html="$t('home.welcome', [$t('global.username.traveler')])"></p>
      <nav>
        <router-link v-for="item in NavigationData" :to="item.path">
          <var-card class="card" ripple>
            <h3>{{ $t(item.name + '.title') }}</h3>
            <p>
              {{ $t(item.name + '.description') }}
              <br />
              <var-chip v-if="item.beta" size="small" type="warning">
                Beta
              </var-chip>
            </p>
          </var-card>
        </router-link>
      </nav>
    </main>
  </div>
</template>

<style lang="css" scoped>
@import url('./home.css');
</style>
