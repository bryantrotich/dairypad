<template>
   <CModal backdrop="static" :visible="modal" alignment="center" @close="modal = false">
        <CForm @submit.prevent="save">
            <CModalHeader>
                <CModalTitle>Create Delivery</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>                   
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="date"
                            label="Date"
                            v-model="$data.form.date"
                        />
                        <p v-show="has($data.errors,'date')" class="text-danger mb-0">{{ $data.errors.date }}</p>              
                    </CCol>
                    <CCol md="12" class="py-2">
                        <label class="form-label">Quantity</label>
                        <CInputGroup>
                            <CFormInput
                                type="number"
                                v-model="$data.form.quantity"
                            />
                            <CInputGroupText>Kg</CInputGroupText>
                        </CInputGroup>
                        <p v-show="has($data.errors,'quantity')" class="text-danger mb-0">{{ $data.errors.quantity }}</p>              
                    </CCol>    
                    <CCol md="12" class="py-2">
                        <CFormSelect label="Self Transported" v-model="$data.form.self_transported">
                            <option>Select Option*</option>
                            <option v-for="(type,index) in $data.self_transported" :key="index" :value="type.value">{{ type.label }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'self_transported')" class="text-danger mb-0">{{ $data.errors.self_transported }}</p>              
                    </CCol>                                    
                    <CCol md="12" class="py-2" v-if="$data.form.self_transported == 'no'">
                        <CFormSelect label="Transporter" v-model="$data.form.transporter">
                            <option>Select Transporter*</option>
                            <option v-for="(transporter,index) in $data.transporters" :key="index" :value="transporter.id">{{ transporter.name }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'transporter')" class="text-danger mb-0">{{ $data.errors.transporter }}</p>              
                    </CCol>  
                    <CCol md="12" class="py-2">
                        <CFormSelect label="Farmer" v-model="$data.form.farmer">
                            <option>Select Farmer*</option>
                            <option v-for="(farmer,index) in $data.farmers" :key="index" :value="farmer.id">{{ farmer.name }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'farmer')" class="text-danger mb-0">{{ $data.errors.farmer }}</p>              
                    </CCol>  
                    <CCol md="12" class="py-2">
                        <CFormSelect label="Shift" v-model="$data.form.shift">
                            <option>Select Shift*</option>
                            <option v-for="(shift,index) in $data.shifts" :key="index" :value="shift.value">{{ shift.label }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'shift')" class="text-danger mb-0">{{ $data.errors.shift }}</p>              
                    </CCol>                                                                          
                </CRow>                                         
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="modal = false">Close</CButton>
                <CButton color="primary" type="submit" :disabled="$data.isDisabled" >
                    <CSpinner v-show="$data.loading" size="sm"/>
                    Save changes
                </CButton>
            </CModalFooter>
        </CForm>
    </CModal> 
</template>
<script setup lang="ts">
import { cloneDeep, each, has, isEmpty } from 'lodash';
import { computed, defineEmits, defineProps, inject, reactive, watch } from 'vue';
import moment from 'moment';
import { number, object, string } from 'yup';

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
    errors: {},
    farmers: [],
    form: {
        date:             moment().format('MM/DD/YYYY'),
        farmer:           "",
        transporter:      "",
        quantity:         0,
        shift:            "",
        self_transported: "",
    },
    shifts: [
        { label: "Evening", value: "evening" },
        { label: "Morning", value: "morning" },
    ],
    self_transported: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
    ],        
    loading: Boolean(),
    isDisabled: Boolean(),
});

const formSchema: any = object().shape({
    date:             string().transform( (curr, orig) => moment(orig).format('MM/DD/YYYY') ).required("*Date is required"),   
    farmer:           string().required("*Farmer is required"),
    transporter:      string().ensure().when('self_transported',{
                        is: 'no',
                        then: () => string().required("*Transporter is required")
                      }),
    quantity:         number().min(1,'*Quantity must be greater than 0').required("*Quantity is required"),
    shift:            string().required("*Shift is required"),
    self_transported: string().required("*Self Transported is required"),
});

/**
 * Resets the form data to its default state.
 *
 * Sets the form fields to their initial values:
 * - `date`: current date formatted as 'MM/DD/YYYY'
 * - `farmer`: empty string
 * - `quantity`: 0
 * - `shift`: empty string
 * - `self_transported`: empty string
 */
const resetForm = () => {
    $data.farmers = [];
    $data.form    = {
        date:             moment().format('MM/DD/YYYY'),
        farmer:           "",
        transporter:      "",
        quantity:         0,
        shift:            "",
        self_transported: "",
    }
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        await $api.post('/deliveries',cloneDeep($data.form));
        // Toast show message
        $toast.success('Delivery has been added.');    
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
 * Fetch all the farmers and transporters from the backend.
 * 
 * This function fetches all the farmers and transporters from the backend and assigns them to the data.farmers and data.transporters properties respectively.
 * It also sets the loader to true while the data is being fetched and false when the data has finished fetching.
 * 
 * @return {void}
 */
const fetchData = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the farmers from the backend
        const { data: { farmers } } = await $api.get('/farmers/fetch');  
        // Fetch the transporters from the backend
        const { data: { transporters } } = await $api.get('/transporters/fetch');  
        // Set the farmers to the data fetched from the backend
        $data.farmers = farmers;
        // Set the transporters to the data fetched from the backend
        $data.transporters = transporters;        
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
        if( value ){
            fetchData();
        }
        // Check if 'show' is false
        if (!value) {
            // Reset the form when 'show' is false
            resetForm();
        }
    }
);
</script>