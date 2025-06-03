<template>
  <Authenticated>
    <CCol md="12">
      <CRow>
        <CCol md="12" class="d-flex justify-content-between">
            <div>
                <h3>List of socities</h3>
                <p>This is a list of registered socities.</p>
            </div>
            <div>
                <CButton color="primary" @click="$data.modals.create = true">Add Society</CButton>
            </div>
        </CCol>
        <CCol md="12">
            <CRow>
                <template v-for="(society,key) in $data.societies.items">
                    <CCol md="3" xs="12" class="mb-4">
                        <CCard>
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
                                    <CAvatar color="primary" size="xl" class="text-white">{{ society.name[0] }}</CAvatar>
                                    <CCol md="12" class="text-center mt-2">
                                        <h5>{{ society.name }}</h5>
                                        <p class="mb-0">{{ society.email }}</p>
                                        <p>{{ society.phone_number }}</p>
                                    </CCol>
                                </CCol>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </template>
            </CRow>
        </CCol>
        <CCol md="12" class="d-flex justify-content-center py-4" v-if="!isEmpty($data.societies)">
            <CPagination aria-label="Page navigation example">
                <CPaginationItem aria-label="Previous" href="#" :disabled="$data.societies.hasPrevPage">
                    <CIcon icon="cil-chevron-left" />
                </CPaginationItem>
                <CPaginationItem href="#" active>1</CPaginationItem>
                <CPaginationItem href="#">2</CPaginationItem>
                <CPaginationItem href="#">3</CPaginationItem>
                <CPaginationItem aria-label="Next" href="#" :disabled="$data.societies.hasNextPage">
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
import { inject, onMounted, reactive } from 'vue';
import { CreateSociety } from '../components';
import { isEmpty } from 'lodash';

const $api:  any = inject('$api');
const $data: any = reactive({
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
        limit:   10
    },
    clients:[
    {
    first_name: "Bryant",
    last_name: "Rotich",
    email: "bryantkrotich@gmail.com",
    phone_number: "+254712182872",
    joined_at: "1st Jan 2024"
    },
    {
    first_name: "Bryant",
    last_name: "Rotich",
    email: "bryantkrotich@gmail.com",
    phone_number: "+254712182872",
    joined_at: "1st Jan 2024"
    },
    {
    first_name: "Bryant",
    last_name: "Rotich",
    email: "bryantkrotich@gmail.com",
    phone_number: "+254712182872",
    joined_at: "1st Jan 2024"
    },
    {
    first_name: "Bryant",
    last_name: "Rotich",
    email: "bryantkrotich@gmail.com",
    phone_number: "+254712182872",
    joined_at: "1st Jan 2024"
    }
    ],
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
        // Fetch the socities from the backend
        const { data: { societies } } = await $api.get('/societies');
        // Set the socities to the data fetched from the backend
        $data.societies = societies;
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loaders.fetch = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loaders.fetch = false;
    }
}

onMounted(fetch);
</script>
