<template>
  <div>
    <Sidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <Header />
      <div class="body flex-grow-1 mt-4">
        <CContainer class="px-4" lg>
          <slot />
        </CContainer>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from '../global/Header.vue'
import Sidebar from '../global/Sidebar.vue'
import { useTitle } from '@vueuse/core';
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { useEnvStore } from '@/stores';

const $route    = useRoute();
const $env      = useEnvStore();

watch(
  () => $route,
  ({ meta: { title }}) => {
    // Set the document title based on the current route path
    useTitle(`${title} | ${$env.VITE_APP_NAME}`);
  },
  { 
    deep: true,
    immediate: true 
  }
)
</script>
