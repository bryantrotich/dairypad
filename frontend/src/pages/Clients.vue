<template>
  <Authenticated>
    <CCol :md="12" :xs="12">
      <CRow>
        <CCol :md="12" :xs="12">
          <h3>List of clients</h3>
          <p>This is a list of registered clients in the system.</p>
        </CCol>
        <CCol :md="12" :xs="12" class="d-flex justify-content-between">
        
        </CCol>
        <template v-for="(client,key) in $data.clients">
          <CCol :md="3" :xs="12">
              <CCard>
                <CCardImage orientation="top" src="https://images.pexels.com/photos/920382/pexels-photo-920382.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
                <CCardBody>
                  <CCardTitle>{{ client.first_name }} {{ client.last_name }}</CCardTitle>
                  <CBadge color="success">active</CBadge>
                </CCardBody>
                <CListGroup flush>
                  <CListGroupItem>Email:     {{ client.email }}</CListGroupItem>
                  <CListGroupItem>Phone:     {{ client.phone_number }}</CListGroupItem>
                  <CListGroupItem>Joined On: {{ client.joined_at }}</CListGroupItem>
                </CListGroup>
                <CCardBody>
                  <CDropdown color="secondary" togglerText="Dropdown button">
                    <CDropdownToggle component="a" color="primary">More</CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#">Edit</CDropdownItem>
                      <CDropdownItem href="#">Deactive</CDropdownItem>
                      <CDropdownItem href="#">Remove</CDropdownItem>
                    </CDropdownMenu>  
                  </CDropdown>
                </CCardBody>
              </CCard>
          </CCol>
        </template>
        <CCol :md="12" :xs="12" class="d-flex justify-content-center py-4">
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
