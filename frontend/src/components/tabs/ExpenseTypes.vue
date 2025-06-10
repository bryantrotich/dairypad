<template>
    <CRow>
        <CCol md="12">
            <CRow v-if="!isEmpty($data.types)">
                <CCol md="12" class="my-3 d-flex justify-content-between">
                    <CCol md="3">
                        <CFormInput
                            type="text"
                            placeholder="eg. Search by name"
                        />           
                    </CCol>  
                    <CCol md="2">             
                        <CFormSelect aria-placeholder="Per Page" v-model="$data.pagination.limit">
                            <option value="">Per Page</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </CFormSelect>    
                    </CCol>               
                </CCol>                      
                <template v-for="(type,key) in $data.types" :key="type.id">
                    <CCol md="3" xs="12" class="mb-4">
                        <CCard class="border-primary">
                            <CCardBody>                            
                                <CCol md="12" class="d-flex justify-content-end">
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
                                </CCol>
                                <CCol md="12" class="d-flex align-items-center flex-column">
                                    <CAvatar color="primary" size="xl" class="text-white">{{ transporter.full_name[0] }}</CAvatar>
                                    <CCol md="12" class="text-center mt-2">
                                        <h5 class="mb-0">{{ transporter.full_name }}</h5>
                                        <p class="mb-0">{{ transporter.email }}</p>
                                        <p class="mb-0">{{ transporter.id_number }}</p>
                                    </CCol>
                                </CCol>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </template>
            </CRow>
            <template v-else>
                <CRow style="height: 20em;" class="d-flex align-items-center">
                    <CCol md="12" class="text-center" v-if="!$data.loaders.fetch">  
                        <h5>
                            <CIcon name="cil-ban" />
                            No expense types found                        
                        </h5>
                        <CButton color="primary" @click="$data.modals.create = true">Add Expense Type</CButton>
                    </CCol>
                    <CCol md="12" class="text-center" v-if="$data.loaders.fetch">  
                        <h5>
                            <CSpinner size="sm"/>
                            Loading...                       
                        </h5>
                    </CCol>       
                </CRow>          
            </template>
            <!-- <CCard v-else class="border-primary" style="height: 20em;">
                <CCardBody class="d-flex align-items-center h-100">
                    <CCol md="12" class="text-center" v-if="!$data.loaders.fetch">  
                        <h5>
                            <CIcon name="cil-ban" />
                            No expense types found                        
                        </h5>
                        <CButton color="primary" @click="$data.modals.create = true">Add Expense Type</CButton>
                    </CCol>
                    <CCol md="12" class="text-center" v-if="$data.loaders.fetch">  
                        <h5>
                            <CSpinner size="sm"/>
                            Loading...                       
                        </h5>
                    </CCol>                        
                </CCardBody>
            </CCard> -->
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
    </CRow>
</template>
<script setup lang="ts">
import { CreateExpenseType } from '../';
import { inject, onMounted, reactive, watch } from 'vue';
import { isEmpty, times } from 'lodash';

const $api:  any = inject('$api');
const $data: any = reactive({
    types: [],
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
        const { data: { count, types, pages } } = await $api.get(`/expense-types?page=${current}&limit=${limit}`);
        // Set the socities to the data fetched from the backend
        $data.types            = types;
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
