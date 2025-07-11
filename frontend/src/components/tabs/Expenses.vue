<template>
    <CRow>
        <CCol md="12" class="d-flex justify-content-end">
            <CButton color="primary" @click="$data.modals.create = true">Add Expense</CButton>
        </CCol>        
        <CCol md="12">
            <CRow v-if="!isEmpty($data.expenses)">
                <CCol md="12" class="my-3 d-flex justify-content-between">
                    <CCol md="3">
                        <CFormInput
                            type="text"
                            placeholder="eg. Search by name"
                        />           
                    </CCol>  
                    <CCol md="2">             
                        <CFormSelect aria-placeholder="Per Page" v-model.number="$data.pagination.limit">
                            <option value="">Per Page</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </CFormSelect>    
                    </CCol>               
                </CCol>       
                <CCol md="12">
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Expense Type</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created On</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="(expense,index) in $data.expenses" v-if="!isEmpty($data.expenses)" :key="expense.id">
                                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                                <CTableDataCell>{{ expense.name }}</CTableDataCell>
                                <CTableDataCell>{{ expense.amount }}</CTableDataCell>
                                <CTableDataCell>{{ expense.date }}</CTableDataCell>
                                <CTableDataCell><CBadge color="primary" class="p-2">{{ expense.type.name }}</CBadge></CTableDataCell>
                                <CTableDataCell>{{ expense.created_at }}</CTableDataCell>
                                <CTableDataCell>
                                    <CDropdown color="secondary">
                                        <CDropdownToggle component="a" :caret="false">
                                            <CIcon icon="cil-options" />
                                        </CDropdownToggle>
                                        <CDropdownMenu class="py-0">
                                            <CDropdownItem href="#" class="text-primary">
                                                <CIcon icon="cil-pencil" />
                                                Edit
                                            </CDropdownItem>
                                            <CDropdownItem href="#" class="text-danger">
                                                <CIcon icon="cil-trash" />
                                                Delete
                                            </CDropdownItem>
                                        </CDropdownMenu>  
                                    </CDropdown>                                      
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow v-else>
                                <CTableHeaderCell colspan="6" class="text-center">
                                    <CIcon name="cil-ban" />
                                    No expense found
                                </CTableHeaderCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>                       
                </CCol>                            
            </CRow>
            <template v-else>
                <CRow style="height: 20em;" class="d-flex align-items-center">
                    <CCol md="12" class="text-center" v-if="!$data.loaders.fetch">  
                        <h5>
                            <CIcon name="cil-ban" />
                            No expense found                        
                        </h5>
                        <CButton color="primary" @click="$data.modals.create = true">Add Expense</CButton>
                    </CCol>
                    <CCol md="12" class="text-center" v-if="$data.loaders.fetch">  
                        <h5>
                            <CSpinner size="sm"/>
                            Loading...                       
                        </h5>
                    </CCol>       
                </CRow>          
            </template>
        </CCol>
        <CCol md="12" class="d-flex justify-content-center py-4" v-if="!isEmpty($data.types)">
            <CPagination aria-label="Page navigation example">
                <CPaginationItem 
                    aria-label="Previous" 
                    href="#" 
                    :disabled="$data.pagination.current == 1" 
                    @click="$data.pagination.current--"
                >
                    <CIcon icon="cil-chevron-left" />
                </CPaginationItem>
                <template v-for="page in times($data.pagination.pages, Number)">
                    <CPaginationItem 
                        href="#" 
                        :active="(page + 1) == $data.pagination.current" 
                        @click="$data.pagination.current = (page + 1)" 
                    >{{ page + 1 }}</CPaginationItem>
                </template>
                <CPaginationItem 
                    aria-label="Next" 
                    href="#" 
                    :disabled="$data.pagination.current == $data.pagination.pages" 
                    @click="$data.pagination.current++"
                >
                    <CIcon icon="cil-chevron-right" />
                </CPaginationItem>
            </CPagination>
        </CCol>
        <CreateExpense
            :show="$data.modals.create" 
            @fetch="fetch" 
            @close="$data.modals.create = $event" 
        />
    </CRow>
</template>
<script setup lang="ts">
import { CreateExpense } from '../';
import { inject, onMounted, reactive, watch } from 'vue';
import { isEmpty, times } from 'lodash';

const $api:  any = inject('$api');
const $data: any = reactive({
    expenses: [],
    modals: {
        create: Boolean(),
        edit:   Boolean(),
    },
    loaders: {
        create: Boolean(),
        edit:   Boolean(),
        fetch:  Boolean(),
        type:  Boolean(),
    },
    pagination: {
        current: 1,
        limit:   5,
        pages:   1,
        total:   1
    },
});

/**
 * Fetch all the socities from the backend
 * 
 * @return {void}
 */
const fetch = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loaders.fetch = true;
        // Destructure pagination
        const { current, limit } = $data.pagination;
        // Fetch the socities from the backend
        const { data: { count, expenses, pages } } = await $api.get(`/expenses?page=${current}&limit=${limit}`);
        // Set the socities to the data fetched from the backend
        $data.expenses         = expenses;
        // Get number of pages
        $data.pagination.pages = pages;
        // Get total number of societies
        $data.pagination.total = count;
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loaders.fetch = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loaders.fetch = false;
    }
}

onMounted(fetch);

watch(
    () => $data.pagination.current,
    () => {
        fetch();
    }
)
</script>
