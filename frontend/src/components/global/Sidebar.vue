<template>
<CSidebar position="fixed">
  <CSidebarHeader class="border-bottom">
    <CSidebarBrand>CoreUI</CSidebarBrand>
  </CSidebarHeader>
  <CSidebarNav>
    <CNavItem @click.prevent="$router.push({ name: 'Overview' })" href="#">
      <CIcon customClassName="nav-icon" icon="cil-speedometer"/> Overview
    </CNavItem>
    <CNavTitle>Data Management</CNavTitle>
    <CNavItem @click.prevent="$router.push({ name: 'Clients' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-group"/> Clients
    </CNavItem>
    <CNavItem @click.prevent="$router.push({ name: 'Socities' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-group"/> Socities
    </CNavItem>    
    <!-- <CNavGroup>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cil-list"/> Posting Categorization
      </template>
      <CNavItem  href="/">
        <CIcon  customClassName="nav-icon" /> Categories
      </CNavItem>
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Sub Categories
      </CNavItem>
      <CNavItem href="/">
        <CIcon  customClassName="nav-icon" /> Child Sub Categories
      </CNavItem>      
    </CNavGroup>     -->
    <!-- <CNavItem href="/">
      <CIcon  customClassName="nav-icon" icon="cil-applications"/> Postings
    </CNavItem>
    <CNavItem href="/">
      <CIcon  customClassName="nav-icon" icon="cil-user"/> Staff
    </CNavItem>
    <CNavItem href="/">
      <CIcon  customClassName="nav-icon" icon="cil-list"/> Subscriptions
    </CNavItem>
    <CNavItem href="/">
      <CIcon  customClassName="nav-icon" icon="cil-money"/> Transactions
    </CNavItem> 
    <CNavItem href="/">
      <CIcon  customClassName="nav-icon" icon="cil-bookmark"/> Advert Placements
    </CNavItem>         -->
    <CNavTitle>Support</CNavTitle>
    <CNavItem @click.prevent="$router.push({ name: 'Clients' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-bell"/> Notifications
    </CNavItem>
    <CNavItem @click.prevent="$router.push({ name: 'Clients' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-envelope-open"/> Chat
    </CNavItem>    
    <CNavTitle>Settings</CNavTitle>
    <CNavItem @click.prevent="$router.push({ name: 'Profile' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-user"/> Profile
    </CNavItem>
    <CNavItem @click.prevent="$router.push({ name: 'Company' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-building"/> Company
    </CNavItem>
    <CNavItem @click.prevent="$router.push({ name: 'System' })" href="#">
      <CIcon  customClassName="nav-icon" icon="cil-cog"/> System
    </CNavItem>
  </CSidebarNav>
  <CSidebarFooter class="border-top">
    <CSidebarToggler/>
  </CSidebarFooter>
</CSidebar>
</template>
<script setup>
import { useRouter } from 'vue-router'

const $router = useRouter();

</script>
