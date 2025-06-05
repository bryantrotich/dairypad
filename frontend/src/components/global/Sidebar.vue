<template>
<CSidebar position="fixed">
  <CSidebarHeader class="border-bottom">
    <CSidebarBrand>CoreUI</CSidebarBrand>
  </CSidebarHeader>
  <CSidebarNav>
    <CNavTitle>Analytics</CNavTitle>
    <CNavItem @click.prevent="$router.push({ name: 'Overview' })" href="#" :active="$route.name === 'Overview'">
      <CIcon customClassName="nav-icon" icon="cil-speedometer"/> Overview
    </CNavItem>
    <CNavTitle>Platform</CNavTitle>
    <CNavItem @click.prevent="$router.push({ name: 'Customers' })" href="#" :active="$route.name === 'Customers'">
      <CIcon  customClassName="nav-icon" icon="cil-group"/> Customers
    </CNavItem>
    <CNavItem @click.prevent="$router.push({ name: 'Products' })" href="#" :active="$route.name === 'Products'">
      <CIcon  customClassName="nav-icon" icon="cil-grid"/> Products
    </CNavItem>    
    <CNavItem @click.prevent="$router.push({ name: 'Societies' })" href="#" :active="$route.name === 'Societies'">
      <CIcon  customClassName="nav-icon" icon="cil-building"/> Societies
    </CNavItem>   
    <CNavItem @click.prevent="$router.push({ name: 'Transporters' })" href="#" :active="$route.name === 'Transporters'">
      <CIcon  customClassName="nav-icon" icon="cil-truck"/> Transporters
    </CNavItem>  
    <CNavItem @click.prevent="$router.push({ name: 'Transporters' })" href="#" :active="$route.name === 'Transporters'">
      <CIcon  customClassName="nav-icon" icon="cil-truck"/> Expenses
    </CNavItem>            
    <CNavGroup>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cil-list"/> HR
      </template>
      <CNavItem  href="/">
        <CIcon  customClassName="nav-icon" /> Employees
      </CNavItem>
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Salaries
      </CNavItem>
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Loans & Advances
      </CNavItem>      
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Overtime
      </CNavItem>   
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Alowances
      </CNavItem>
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Allowance Types
      </CNavItem>   
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Deductions
      </CNavItem>       
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Deduction Types
      </CNavItem>                                       
    </CNavGroup>   
    <CNavTitle>Management</CNavTitle>
    <CNavGroup :visible="$route.name == 'Profile' || $route.name == 'Company' || $route.name == 'System'" compact>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cil-list"/> Roles & Permissions
      </template>
    </CNavGroup>     
    <CNavGroup :visible="$route.name == 'Profile' || $route.name == 'Company' || $route.name == 'System'" compact>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cil-cog"/> Account
      </template> 
      <CNavItem @click.prevent="$router.push({ name: 'Profile' })" href="#" :active="$route.name === 'Profile'">
        <CIcon  customClassName="nav-icon"/> Profile
      </CNavItem>
      <CNavItem @click.prevent="$router.push({ name: 'Company' })" href="#" :active="$route.name === 'Company'">
        <CIcon  customClassName="nav-icon"/> Company
      </CNavItem>
      <CNavItem @click.prevent="$router.push({ name: 'System' })" href="#" :active="$route.name === 'System'">
        <CIcon  customClassName="nav-icon"/> System
      </CNavItem>        
    </CNavGroup>             
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
import { isNull } from 'lodash';
import { computed } from 'vue';

const authStore = useAuthStore();
const $router   = useRouter();
const $route    = useRoute();

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
