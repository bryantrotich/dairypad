<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="my-auto" :caret="false">
      <!-- <CAvatar :src="avatar" size="md" /> -->
       <CIcon icon="cil-user" size="lg" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Settings
      </CDropdownHeader>
      <CDropdownItem @click="$router.push({ name: 'Profile' })" href="#">        
        <CIcon icon="cil-user" /> 
        Profile 
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem @click="authStore.logout()" href="#"> 
        <CIcon icon="cil-lock-locked" /> 
        Logout 
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const $router = useRouter();
</script>
