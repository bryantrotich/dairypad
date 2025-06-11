<template>
    <Authenticated>
        <CCol md="12">
            <CRow>
                <CCol md="12">
                    <h3>List of expenses</h3>
                    <p>This is a list of expenses</p>
                </CCol>
                <CCol md="12">
                    <CCard class="border-primary">
                        <CCardBody>                       
                            <CTabs :activeItemKey="$data.tab">
                                <CTabList variant="enclosed" layout="fill">
                                    <CTab aria-controls="expenses-tab-pane"      :itemKey="1">Expenses</CTab>
                                    <CTab aria-controls="expense-types-tab-pane" :itemKey="2">Expense Types</CTab>
                                </CTabList>
                                <CTabContent>
                                    <CTabPanel class="py-3" aria-labelledby="expenses-tab-pane" :itemKey="1">
                                        <Expenses />
                                    </CTabPanel>
                                    <CTabPanel class="py-3" aria-labelledby="expense-types-tab-pane" :itemKey="2">
                                        <ExpenseTypes />
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
import { Authenticated, Expenses, ExpenseTypes } from '../components';
import { reactive } from 'vue';

const $data: any = reactive({
    tab: 1
});
</script>
