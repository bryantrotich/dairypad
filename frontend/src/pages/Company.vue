<template>
  <Authenticated>
    <CRow>
        <CCol md="12">
          <h3>Company</h3>
          <p>Manage company information.</p>
        </CCol>         
        <CCol md="10">
            <CCard>
                <CCardBody>
                    <p class="text-body-secondary">This is your profile page.</p>
                    <p class="text-body-secondary">You can update your profile information here.</p>
                </CCardBody>    
            </CCard>            
        </CCol>
        <CCol md="2">
            <CNav class="flex-column">
                <CNavItem>
                    <CNavLink href="#" active>
                    Active
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href="#">Link</CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href="#">Link</CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href="#" disabled>
                    Disabled
                    </CNavLink>
                </CNavItem>
            </CNav>         
        </CCol>        
    </CRow>
  </Authenticated>
</template>
<script setup lang="ts">
import { Authenticated } from '../components';
import { reactive } from 'vue';

const $data = reactive({

});
</script>
