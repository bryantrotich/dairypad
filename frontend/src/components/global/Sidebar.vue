<template>
<CSidebar position="fixed">
  <CSidebarHeader class="border-bottom">
    <CSidebarBrand>CoreUI</CSidebarBrand>
  </CSidebarHeader>
  <CSidebarNav>
    <template v-for="(group,group_index) in links" :key="`${group.title}_${group_index}`">
      <CNavTitle>{{ group.title }}</CNavTitle>  
      <template v-for="(link,link_index) in group.children" :key="`${link.title}_${link_index}`">
        <template v-if="has(link,'children')">
          <CNavGroup :visible="link.visible.includes($route.name)">    
            <template #togglerContent>
              <CIcon  customClassName="nav-icon" :icon="link.icon"/>
              {{ link.label }}
            </template>           
            <template v-for="(sub_link,sub_link_index) in link.children" :key="`${sub_link.title}_${sub_link_index}`">              
              <CNavItem @click.prevent="$router.push(sub_link.to)" href="#" :active="$route.name === sub_link.to.name">
                {{ sub_link.label }}
              </CNavItem>   
            </template>
          </CNavGroup>        
        </template>
        <template v-if="!has(link,'children')">
          <CNavItem @click.prevent="$router.push(link.to)" href="#" :active="$route.name === link.to.name">
            <CIcon customClassName="nav-icon" :icon="link.icon"/> 
            {{ link.label }}
          </CNavItem>          
        </template>        
      </template>
    </template>
  </CSidebarNav>
  <CSidebarFooter class="border-top">
    <CDropdown placement="bottom-end" variant="nav-item">
      <CDropdownToggle :caret="false" >
        <CCol md="12" class="d-flex align-items-center">
          <CAvatar color="primary" class="text-white m-2">
            {{ user.first_name[0] }}
          </CAvatar>
          <p class="mb-0">
            {{ user.first_name }} {{ user.last_name }} <br>
              <CBadge v-if="!isNull(user.society)" color="primary">{{ user.society.name }}</CBadge> <br>
            {{ user.email }}
          </p>
        </CCol>
      </CDropdownToggle>
      <CDropdownMenu class="p-0 border-0" style="width: 15vw;">
        <CListGroup class="border-primary">
          <CListGroupItem as="div">
            <CCol md="12" class="d-flex align-items-center">
              <CAvatar color="primary" class="text-white m-2">{{ user.first_name[0] }}</CAvatar>
              <p class="mb-0">
                {{ user.first_name }} {{ user.last_name }} <br>
                <CBadge v-if="!isNull(user.society)" color="primary">{{ user.society.name }}</CBadge> <br>
                {{ user.email }}
              </p>                 
            </CCol>         
          </CListGroupItem>
          <CListGroupItem as="button" @click="$router.push({ name: 'Profile' })">Profile</CListGroupItem>
          <CListGroupItem as="button" @click="$router.push({ name: 'Societies' })">Societies</CListGroupItem>
          <CListGroupItem as="button" @click="$router.push({ name: 'Profile' })">Notifications</CListGroupItem>
          <CListGroupItem as="button" @click="logout">Logout</CListGroupItem>
        </CListGroup>         
      </CDropdownMenu>
    </CDropdown>
  </CSidebarFooter>
</CSidebar>
</template>
<script setup>
import { useAuthStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { groupBy, has, isNull } from 'lodash';
import { computed } from 'vue';

const authStore       = useAuthStore();
const $router         = useRouter();
const $route          = useRoute();

const links     = computed( () => authStore.links );
const user      = computed( () => authStore.auth.user );
/**
 * Logs the user out and redirects to the login page
 */
const logout = () => {
  // Clear the authentication data from local storage
  authStore.logout();
  // Redirect the user to the login page
  $router.push({ name: 'Login' });
}
</script>
