<template>
    <Authenticated>
        <CCard class="border-primary">
            <CCardBody>        
                <CContainer class="d-flex flex-column align-items-center justify-content-center text-center">
                    <CIcon icon="cil-lock-locked" size="4xl" class="text-danger" />
                    <h1 class="display-3 text-danger">403</h1>
                    <h4 class="mb-3">Access Forbidden</h4>
                    <p class="text-muted">You don't have permission to view this page.</p>
                    <CButton color="primary" @click="$router.go(-1)">Go to Back</CButton>                    
                </CContainer>
            </CCardBody>
        </CCard>        
  </Authenticated>
</template>

<script setup>
import { Authenticated } from '@/components';
import { useRouter } from 'vue-router';

const $router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.display-3 {
  font-size: 6rem;
  font-weight: 700;
}
</style>
