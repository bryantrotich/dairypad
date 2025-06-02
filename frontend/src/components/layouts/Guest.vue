<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
        <CRow class="justify-content-center">
            <CCol md="12" xs="12">

            </CCol>
            <slot />
        </CRow>
    </CContainer>
  </div>        
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { useEnvStore } from '@/stores';
import { useTitle } from '@vueuse/core';

const $route = useRoute();
const $env   = useEnvStore();

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
