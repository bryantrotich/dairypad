<template>
    <Authenticated>
        <CCol md="12">
            <CRow>
                <CCol md="12">
                    <h3>List of roles and permissions</h3>
                    <p>Manage roles and permissions in the society.</p>
                </CCol>
                <CCol md="12">
                    <CCard class="border-primary">
                        <CCardBody>                       
                            <CTabs :activeItemKey="$data.tab">
                                <CTabList variant="enclosed" layout="fill">
                                    <CTab aria-controls="expenses-tab-pane"      :itemKey="1" v-if="$data.roles_tab">Roles</CTab>
                                    <CTab aria-controls="expense-types-tab-pane" :itemKey="2" v-if="$data.permissions_tab">Permissions</CTab>
                                </CTabList>
                                <CTabContent>
                                    <CTabPanel class="py-3" aria-labelledby="expenses-tab-pane" :itemKey="1" v-if="$data.roles_tab">
                                        <Roles />
                                    </CTabPanel>
                                    <CTabPanel class="py-3" aria-labelledby="expense-types-tab-pane" :itemKey="2" v-if="$data.permissions_tab">
                                        <Permissions />
                                    </CTabPanel>
                                </CTabContent>
                            </CTabs>        
                        </CCardBody>
                    </CCard>        
                </CCol>
            </CRow>
        </CCol>
    </Authenticated>
</template>
<script setup lang="ts">
import { Authenticated, Permissions, Roles } from '../components';
import { onBeforeMount, reactive } from 'vue';
import { useAuthStore } from '../stores/auth';

const $data: any = reactive({
    tab: 1,
    roles_tab:       false,
    permissions_tab: false
});

onBeforeMount(() => {
    const { auth: { permissions } } = useAuthStore();
    $data.roles_tab       = permissions.includes('READ_ROLES');   
    $data.permissions_tab = permissions.includes('READ_PERMISSIONS');   
}); 

</script>
