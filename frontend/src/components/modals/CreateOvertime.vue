<template>
   <CModal backdrop="static" :visible="modal" alignment="center" @close="modal = false" >
        <CForm @submit.prevent="save">
            <CModalHeader>
                <CModalTitle>Create Salary</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>   
                    <CCol md="12" class="py-2">
                        <CFormSelect label="Employee" v-model="$data.form.employee">
                            <option>Select Employee*</option>
                            <option v-for="(employee,index) in $data.employees" :key="index" :value="employee.id">{{ employee.name }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'employee')" class="text-danger mb-0">{{ $data.errors.employee }}</p>              
                    </CCol>  
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="number"
                            label="Hourly Rate"
                            placeholder="eg. Kshs 20000"
                            v-model.number="$data.form.hourly_rate"
                        />
                        <p v-show="has($data.errors,'hourly_rate')" class="text-danger mb-0">{{ $data.errors.hourly_rate }}</p>              
                    </CCol> 
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="number"
                            label="Hours Worked"
                            placeholder="eg. Kshs 20000"
                            v-model.number="$data.form.hours"
                        />
                        <p v-show="has($data.errors,'hours')" class="text-danger mb-0">{{ $data.errors.hours }}</p>              
                    </CCol>                      
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="date"
                            label="Overtime Date"
                            placeholder="eg. 02/02/2023"
                            v-model="$data.form.date"
                        />
                        <p v-show="has($data.errors,'date')" class="text-danger mb-0">{{ $data.errors.date }}</p>              
                    </CCol> 
                    <CCol md="12" class="py-2">
                        <CFormTextarea
                            label="Notes"
                            v-model="$data.form.notes"
                        ></CFormTextarea>
                        <p v-show="has($data.errors,'notes')" class="text-danger mb-0">{{ $data.errors.notes }}</p>              
                    </CCol>                                                                                                                                                                                           
                </CRow>                                         
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="modal = false" :disabled="$data.loading">Close</CButton>
                <CButton color="primary" type="submit" :disabled="$data.isDisabled || $data.loading" >
                    <CSpinner v-show="$data.loading" size="sm"/>
                    Save changes
                </CButton>
            </CModalFooter>
        </CForm>
    </CModal> 
</template>
<script setup lang="ts">
import { CSpinner } from '@coreui/vue';
import { cloneDeep, each, has, isEmpty } from 'lodash';
import moment from 'moment';
import { computed, defineEmits, defineProps, inject, reactive, watch } from 'vue';
import { boolean, date, number, object, string } from 'yup';

const $api: any   = inject('$api');
const $toast: any = inject('$toast');
const $i18n:  any = inject('$i18n');
const $emit: any  = defineEmits(['fetch','close']);
const modal: any  = computed({
    get: ()      => $props.show,
    set: (value) => $emit('close', value)
});

const $props = defineProps({
    show: {
        default: Boolean(),
        type:    Boolean
    }
});

const $data: any = reactive({
    employees: [],
    errors:    {},
    form: {
        date:        moment().format('MM/DD/YYYY'),
        employee:    "",
        hours:       0,
        hourly_rate: 0,
        notes:       "",
    },
    loading: Boolean(),
    isDisabled: Boolean(),
});

const formSchema: any = object().shape({
    date:        string().transform( (curr, orig) => moment(orig).format('MM/DD/YYYY') ).required("*Date is required"),   
    employee:    string().required("*Employee is required"),
    hours:       number().min(1,'*Hours must be greater than 0').required("*Hours is required"),
    hourly_rate: number().min(1,'*Hourly Rate must be greater than 0').required("*Hourly Rate is required"),
    notes:       string().required("*Notes is required"),
});

/**
 * Resets the form data to its default state.
 *
 * Sets the form fields to their initial values:
 * - `date`: current date formatted as 'MM/DD/YYYY'
 * - `employee`: empty string
 * - `hours`: 0
 * - `hourly_rate`: 0
 * - `notes`: empty string
 */

const resetForm = () => {
    $data.form = {
        date:        moment().format('MM/DD/YYYY'),
        employee:    "",
        hours:       0,
        hourly_rate: 0,
        notes:       "",
    }
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        const { data: { customer } } = await $api.post('/overtime',cloneDeep($data.form));
        // Toast show message
        $toast.success('Salary has been added.');    
        // Set the socities to the data fetched from the backend
        modal.value = false;
        // Fetch data
        $emit('fetch');
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loading = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loading = false;
    }
}

/**
 * Fetch all the roles from the backend.
 * 
 * This function fetches all the roles from the backend and assigns them to the data.roles property.
 * It also sets the loader to true while the data is being fetched and false when the data has finished fetching.
 * 
 * @return {void}
 */
const fetchEmployees = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the roles from the backend
        const { data: { employees } } = await $api.get('/employees/fetch');  
        // Set the roles to the data fetched from the backend
        $data.employees = employees;
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
        $data.loading = false;
    } finally {
        // Set the loader to false so that the user knows that the data has finished fetching
        $data.loading = false;
    }
}

/**
 * Validates a form field based on the provided field name.
 * Uses the formSchema to validate the field and updates the errors object accordingly.
 * Updates the isDisabled property based on the presence of errors.
 *
 * @param {string} field - The name of the field to validate.
 */
const validateForm = async (field:string) => {
    try {
        // Validate the field using the formSchema
        await formSchema.validateAt(field, $data.form);
		delete $data.errors[field];
    } catch(error: any) {
        // If the field is invalid, update the errors object with the error message
        $data.errors[error.path] = error.message;
    } finally {
        // Update the isDisabled property based on the presence of errors
        $data.isDisabled = !isEmpty($data.errors);
    }
}

/**
 * Watches for changes in the form data.
 *
 * Iterates over each field in the form and validates it using the validateForm function.
 * The watch is set to deep to ensure nested properties are observed.
 */
 watch(
  () => $data.form, 
  (form) => {
    // Iterate over each field in the form and validate it
    each(
      form,
      (value, key) => {
        validateForm(key); // Validate the individual form field
      }
    );
  },
  { 
    deep: true, // Set to true to observe nested properties
    immediate: true
  }
);

/**
 * Watches for changes in the 'show' prop.
 *
 * @param {Function} - Returns the current state of the 'show' prop.
 * @param {Function} - Callback function triggered when the 'show' prop changes.
 *                     Resets the form if 'show' is set to false.
 */
watch(
    () => $props.show, // Function to watch the 'show' prop
    (value: boolean) => {
        // Fetch roles
        if( value ){
            fetchEmployees();
        }

        // Check if 'show' is false
        if (!value) {
            // Reset the form when 'show' is false
            resetForm();
        }
    }
);
</script>