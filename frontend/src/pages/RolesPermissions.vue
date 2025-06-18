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
                                    <CTab aria-controls="expenses-tab-pane"      :itemKey="1">Roles</CTab>
                                    <CTab aria-controls="expense-types-tab-pane" :itemKey="2">Permissions</CTab>
                                </CTabList>
                                <CTabContent>
                                    <CTabPanel class="py-3" aria-labelledby="expenses-tab-pane" :itemKey="1">
                                        <Roles />
                                    </CTabPanel>
                                    <CTabPanel class="py-3" aria-labelledby="expense-types-tab-pane" :itemKey="2">
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
import { reactive } from 'vue';

const $data: any = reactive({
    tab: 1
});
</script>
