<template>
  <Authenticated>
    <CCol md="12">
      <CRow>
        <CCol md="12" class="d-flex justify-content-between">
            <div>
                <h3>List of deliveries</h3>
                <p>Manage deliveries listed in the society.</p>
            </div>
            <div>
                <CButton color="primary" @click="$data.modals.create = true">Add Delivery</CButton>
            </div>
        </CCol>
        <CCol md="12">
            <CRow>
                <CCol md="12">
                    <CCard class="border-primary">
                        <CCardBody>
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
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Delivery Date</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Self Transported</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Shift</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Created On</CTableHeaderCell>
                                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    <CTableRow v-for="(delivery,index) in $data.deliveries" v-if="!isEmpty($data.deliveries)" :key="delivery.id">
                                        <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                                        <CTableDataCell>{{ delivery.farmer.name }}</CTableDataCell>
                                        <CTableDataCell>{{ delivery.quantity }}</CTableDataCell>
                                        <CTableDataCell>{{ delivery.date }}</CTableDataCell>
                                        <CTableDataCell class="text-center">
                                            <CBadge :color="delivery.self_transported == 'yes' ? 'success' : 'primary'" class="p-2">
                                                {{ capitalize(delivery.self_transported) }}
                                                <CIcon name="cil-truck" v-c-tooltip="{ content: capitalize(delivery.transporter.name) }" v-if="!isNull(delivery.transporter)"/>
                                            </CBadge>
                                        </CTableDataCell>
                                        <CTableDataCell>{{ capitalize(delivery.shift) }}</CTableDataCell>
                                        <CTableDataCell>{{ delivery.created_at }}</CTableDataCell>
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
                                            No deliveries found
                                        </CTableHeaderCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                            <CCol md="12">
                                <CPagination aria-label="Paginate deliverys" size="sm" align="center" class="mb-0">
                                    <CPaginationItem 
                                        class="mb-0"
                                        aria-label="Previous" 
                                        href="#" 
                                        :disabled="!isEmpty($data.deliveries) && $data.pagination.current == 1" 
                                        @click="$data.pagination.current--"
                                    >
                                        <CIcon icon="cil-chevron-left" />
                                    </CPaginationItem>
                                    <template v-for="page in times($data.pagination.pages, Number)" v-if="!isEmpty($data.deliveries)">
                                        <CPaginationItem 
                                            class="mb-0"
                                            aria-label="Next"
                                            href="#" 
                                            :active="(page + 1) == $data.pagination.current" 
                                            @click="$data.pagination.current = (page + 1)" 
                                        >{{ page + 1 }}</CPaginationItem>
                                    </template>
                                    <CPaginationItem 
                                        class="mb-0"
                                        aria-label="Next" 
                                        href="#" 
                                        :disabled="!isEmpty($data.deliveries) &&$data.pagination.current == $data.pagination.pages" 
                                        @click="$data.pagination.current++"
                                    >
                                        <CIcon icon="cil-chevron-right" />
                                    </CPaginationItem>
                                </CPagination>
                            </CCol>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCol>
      </CRow>
     <CreateDelivery 
        :show="$data.modals.create" 
        @fetch="fetch" 
        @close="$data.modals.create = $event" 
    />
    </CCol>
  </Authenticated>
</template>
<script setup lang="ts">
import { Authenticated, CreateDelivery } from '../components';
import { inject, onMounted, reactive, watch } from 'vue';
import { capitalize, isEmpty, isNull, times } from 'lodash';
import { CTableRow } from '@coreui/vue';

const $api:  any = inject('$api');
const $data: any = reactive({
    deliveries: [],
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
        const { data: { count, deliveries, pages } } = await $api.get(`/deliveries?page=${current}&limit=${limit}`);
        // Set the socities to the data fetched from the backend
        $data.deliveries        = deliveries;
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
