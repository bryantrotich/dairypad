<template>
    <CRow>
        <CCol md="12" class="d-flex justify-content-end">
            <CButton color="primary" @click="$data.modals.create = true">Add Role</CButton>
        </CCol>        
        <CCol md="12">
            <CRow v-if="!isEmpty($data.roles)">
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
                                <CTableHeaderCell scope="col">Permissions</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created On</CTableHeaderCell>
                                <CTableHeaderCell scope="col"></CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="(role,index) in $data.roles" v-if="!isEmpty($data.roles)" :key="role.id">
                                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                                <CTableDataCell>{{ role.name }}</CTableDataCell>
                                <CTableDataCell>{{ role.permissions.length}}</CTableDataCell>
                                <CTableDataCell>{{ role.created_at }}</CTableDataCell>
                                <CTableDataCell>
                                    <CDropdown color="secondary">
                                        <CDropdownToggle component="a" :caret="false">
                                            <CIcon icon="cil-options" />
                                        </CDropdownToggle>
                                        <CDropdownMenu class="py-0">
                                            <CDropdownItem href="#" class="text-primary" @click="show(role.id)">
                                                <CIcon icon="cil-pencil" />
                                                Edit
                                            </CDropdownItem>
                                            <CDropdownItem href="#" class="text-danger" @click="remove(role.id)">
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
                                    No roles found
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
                            No roles found                        
                        </h5>
                        <CButton color="primary" @click="$data.modals.create = true">Add Role</CButton>
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
        <CCol md="12" class="d-flex justify-content-center py-4" v-if="!isEmpty($data.roles)">
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
        <CreateRole
            :show="$data.modals.create" 
            @fetch="fetch" 
            @close="$data.modals.create = $event" 
        />
        <UpdateRole
            :data="$data.role"
            :show="$data.modals.show" 
            @fetch="fetch" 
            @close="$data.modals.show = $event" 
        />        
    </CRow>
</template>
<script setup lang="ts">
import { CreateRole, UpdateRole } from '../';
import { inject, onBeforeMount, reactive, watch } from 'vue';
import { debounce, isEmpty, times } from 'lodash';

const $api:   any = inject('$api');
const $toast: any = inject('$toast');
const $swal: any  = inject('$swal');
const $data:  any = reactive({
    roles: [],
    role:  {},
    modals: {
        create: Boolean(),
        show:   Boolean(),
    },
    loaders: {
        create: Boolean(),
        delete: Boolean(),
        edit:   Boolean(),
        fetch:  Boolean(),
        type:   Boolean(),
    },
    pagination: {
        current: 1,
        limit:   5,
        pages:   1,
        total:   1
    },
});

/**
 * Fetch all the roles from the backend
 *
 * This function fetches all the roles from the backend and assigns them to the
 * $data.roles property. It also sets the loader to true while the data is being
 * fetched and false when the data has finished fetching. The function can throw
 * an error if the data cannot be fetched.
 *
 * @return {void}
 */
const fetch = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loaders.fetch = true;
        // Destructure pagination
        const { current, limit } = $data.pagination;
        // Fetch the roles from the backend
        const { data: { count, roles, pages } } = await $api.get(`/roles?page=${current}&limit=${limit}`);
        // Set the roles to the data fetched from the backend
        $data.roles            = roles;
        // Get number of pages
        $data.pagination.pages = pages;
        // Get total number of roles
        $data.pagination.total = count;
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loaders.fetch = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loaders.fetch = false;
    }
}

/**
 * Fetch all the roles from the backend
 *
 * This function fetches all the roles from the backend and assigns them to the
 * $data.roles property. It also sets the loader to true while the data is being
 * fetched and false when the data has finished fetching. The function can throw
 * an error if the data cannot be fetched.
 *
 * @return {void}
 */
const show = async (id: string) => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loaders.show = true;
        // Fetch the roles from the backend
        const { data: { role } } = await $api.put(`/roles/${id}/show`);
        // Set the roles to the data fetched from the backend
        $data.role               = role;
        // View modal
        $data.modals.show        = true;
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loaders.show = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loaders.show = false;
    }
}


const remove = async (id: string) => {
    try {

        // Show a confirmation dialog
        const { isConfirmed } = await $swal.fire({
            title: 'Are you sure?',
            text:  'You are about to delete this role. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        // If the user clicks cancel, return
        if( !isConfirmed ) return;

        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loaders.delete = true;

        // Fetch the socities from the backend
        await $api.delete(`roles/${id}/delete`);

        // Toast show message
        $toast.success('Role deleted successfully');

        // Fetch new roles
        fetch();
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loaders.delete = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loaders.delete = false;
    }    
}

onBeforeMount(fetch);

/**
 * Watches for changes in the 'current' property of the pagination object.
 *
 * When the current page changes, fetch the roles from the backend again.
 */
watch(
    () => $data.pagination.current,
    () => {
        // Fetch the roles from the backend again
        fetch();
    }
)

/**
 * Watches for changes in the 'show' prop of the modal.
 *
 * @param {Boolean} value - The current state of the 'show' prop.
 */
watch(
    () => $data.modals.show,
    debounce(
        (value: boolean) => {
        // If the modal is not showing, reset the role to an empty object
        if( !value ){
            $data.role = {};
        }
    },200)
)
</script>
