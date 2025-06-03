<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="my-auto" :caret="false">
      <!-- <CAvatar :src="avatar" size="md" /> -->
       <CIcon icon="cil-user" size="lg" />
    </CDropdownToggle>
    <CDropdownMenu class="py-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold"
      >
        {{ user.first_name }} {{ user.last_name }} <br>
        {{ user.email }}
      </CDropdownHeader>
      <CDropdownItem @click="$router.push({ name: 'Profile' })" href="#" class="py-2">        
        <CIcon icon="cil-user" /> 
        Profile 
      </CDropdownItem>
      <CDropdownDivider class="my-0" />
      <CDropdownItem @click="logout" href="#" class="py-2"> 
        <CIcon icon="cil-lock-locked" /> 
        Logout 
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const $router   = useRouter();

const user      =  computed( () => authStore.auth.user );
/**
 * Logs the user out and redirects to the login page
 */
const logout = (): any => {
  // Clear the authentication data from local storage
  authStore.logout();
  // Redirect the user to the login page
  $router.push({ name: 'Login' });
}
</script>
