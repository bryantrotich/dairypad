<template>
  <Authenticated>
    <CCol md="12">
      <CRow>
        <CCol md="12">
          <h3>List of socities</h3>
          <p>This is a list of registered socities in the system.</p>
        </CCol>
        <CCol md="12">
            <CCard>
                <CCardBody>
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                <CTableDataCell>Mark</CTableDataCell>
                                <CTableDataCell>Otto</CTableDataCell>
                                <CTableDataCell>@mdo</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                <CTableDataCell>Jacob</CTableDataCell>
                                <CTableDataCell>Thornton</CTableDataCell>
                                <CTableDataCell>@fat</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                <CTableDataCell colspan="2">Larry the Bird</CTableDataCell>
                                <CTableDataCell>@twitter</CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>      
                </CCardBody>
            </CCard>              
        </CCol>
        <CCol md="12" class="d-flex justify-content-center py-4">
          <CPagination aria-label="Page navigation example">
            <CPaginationItem href="#">Previous</CPaginationItem>
            <CPaginationItem href="#">1</CPaginationItem>
            <CPaginationItem href="#">2</CPaginationItem>
            <CPaginationItem href="#">3</CPaginationItem>
            <CPaginationItem href="#">Next</CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>
    </CCol>
  </Authenticated>
</template>
<script setup lang="ts">
import { Authenticated } from '../components';
import { reactive } from 'vue';

const $data = reactive({
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
</script>
