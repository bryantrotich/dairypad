<template>
  <Authenticated>
    <CCol md="12">
      <CRow>
        <CCol md="12" class="d-flex justify-content-between">
            <div>
                <h3>List of societies</h3>
                <p>This is a list of registered societies.</p>
            </div>
            <div>
                <CButton color="primary" @click="$data.modals.create = true">Add Society</CButton>
            </div>
        </CCol>
        <CCol md="12">
            <CRow v-if="!isEmpty($data.societies)">
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
                <template v-for="(society,key) in $data.societies" :key="society.id">
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
                                            <CDropdownItem href="#" class="text-danger" @click="remove(society.id)">
                                                <CIcon icon="cil-trash" />
                                                Delete
                                            </CDropdownItem>
                                        </CDropdownMenu>  
                                    </CDropdown>                                        
                                </CCol>
                                <CCol md="12" class="d-flex align-items-center flex-column">
                                    <CAvatar color="primary" size="xl" class="text-white">{{ society.name[0] }}</CAvatar>
                                    <CCol md="12" class="text-center mt-2">
                                        <h5>{{ society.name }}</h5>
                                        <p class="mb-0">{{ society.email }}</p>
                                        <p class="mb-0">{{ society.phone_number }}</p>
                                        <div class="col-12 d-flex justify-content-center">
                                            <CFormSwitch 
                                                size="xl" 
                                                :id="`switch_society_${society.id}`" 
                                                v-c-tooltip="'Switch to this society'" 
                                                :checked="!isEmpty(current_society) ? current_society.id == society.id : false"
                                                @change="switch_society({ id: society.id })" 
                                            />
                                        </div>
                                    </CCol>
                                </CCol>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </template>
            </CRow>
            <CCard v-else class="border-primary" style="height: 20em;">
                <CCardBody class="d-flex align-items-center h-100">
                    <CCol md="12" class="text-center" v-if="!$data.loaders.fetch">
                        <h5>
                            <CIcon name="cil-ban" />
                            No societies found                        
                        </h5>
                        <CButton color="primary" @click="$data.modals.create = true">Add Society</CButton>
                    </CCol>
                    <CCol md="12" class="text-center" v-if="$data.loaders.fetch">  
                        <h5>
                            <CSpinner size="sm"/>
                            Loading...                       
                        </h5>
                    </CCol>                    
                </CCardBody>
            </CCard>
        </CCol>
        <CCol md="12" class="d-flex justify-content-center py-4" v-if="!isEmpty($data.societies)">
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
     <CreateSociety :show="$data.modals.create" @fetch="fetch" @close="$data.modals.create = $event" />
    </CCol>
  </Authenticated>
</template>
<script setup lang="ts">
import { Authenticated } from '../components';
import { computed, inject, onMounted, reactive, watch } from 'vue';
import { CreateSociety } from '../components';
import { isEmpty, isNull, set, times } from 'lodash';
import { CCardBody } from '@coreui/vue';
import { useAuthStore } from '@/stores';

const { auth, update: updateAuthStore }: any = useAuthStore();
const $api:      any  = inject('$api');
const $toast:    any  = inject('$toast');
const $i18n:     any  = inject('$i18n');
const $swal:     any  = inject('$swal');
const $data:     any  = reactive({
    societies: {},
    modals: {
        create: Boolean(),
        edit:   Boolean(),
    },
    loaders: {
        create: Boolean(),
        edit:   Boolean(),
        fetch:  Boolean(),
    },
    pagination: {
        current: 1,
        limit:   5,
        pages:   1,
        total:   1
    },
});
const current_society = computed( () => !isNull(auth.user.society) ? auth.user.society : {} );

/**
 * Fetch all the socities from the backend
 * 
 * @return {void}
 */
const fetch = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loaders.fetch = true;
        const { current, limit } = $data.pagination;
        // Fetch the socities from the backend
        const { data: { count, societies, pages } } = await $api.get(`/societies?page=${current}&limit=${limit}`);
        // Set the socities to the data fetched from the backend
        $data.societies        = societies;
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

/**
 * Fetch all the socities from the backend
 * 
 * @return {void}
 */
const switch_society = async ({ id }:any) => {
    try {

        /**
         * Send a request to switch the current society.
         * 
         * @param {string} id - The ID of the society to switch to.
         * @returns {Promise<void>} - Resolves with the updated user data.
         */
        const { data: { user, permissions } } = await $api.put(`/societies/${id}/switch`);

        $toast.success($i18n.t('societies.messages.success.switched',{ name: user.society.name }));

        /**
         * Update the authentication state with the new user data.
         */
        set(auth, 'user', user);

        // Update the permissions in the auth store
        set(auth, 'permissions', permissions);

        /**
         * Persist the updated authentication state back to the auth store.
         */
        updateAuthStore(auth);
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loaders.fetch = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loaders.fetch = false;
    }
}

const remove = async (id: string) => {
    try {

        // Show a confirmation dialog
        const { isConfirmed } = await $swal.fire({
            title: 'Are you sure?',
            text:  'You are about to delete this society. This action cannot be undone.',
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
        await $api.delete(`societies/${id}/delete`);

        // Toast show message
        $toast.success('Society has been removed');

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

onMounted(fetch);

watch(
    () => $data.pagination.current,
    () => {
        fetch();
    }
)

watch(
    () => $data.pagination.limit,
    () => {
        fetch();
    }
)
</script>
