<template>
   <CModal backdrop="static" :visible="modal" alignment="center" @close="modal = false">
        <CForm @submit.prevent="save">
            <CModalHeader>
                <CModalTitle>Create Expense</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CCol md="12" class="py-2">
                    <CFormInput
                        type="text"
                        label="Name"
                        placeholder="eg. Name"
                        v-model="$data.form.name"
                    />
                    <p v-show="has($data.errors,'name')" class="text-danger mb-0">{{ $data.errors.name }}</p>              
                </CCol>
                <CCol md="12" class="py-2">
                    <CFormInput
                        type="text"
                        label="Transaction ID"
                        placeholder="eg Transaction ID (Optional)"
                        v-model="$data.form.transaction_id"
                    />
                    <p v-show="has($data.errors,'transaction_id')" class="text-danger mb-0">{{ $data.errors.transaction_id }}</p>              
                </CCol>
                <CCol md="12" class="py-2">
                    <CFormInput
                        type="date"
                        label="Date"
                        placeholder="eg. 01/01/2021"
                        v-model="$data.form.date"    
                        :max="moment().format('YYYY-MM-DD')"                    
                    />
                    <p v-show="has($data.errors,'date')" class="text-danger mb-0">{{ $data.errors.date }}</p>              
                </CCol> 
                <CCol md="12" class="py-2">
                    <CFormInput
                        type="number"
                        label="Amount"
                        placeholder="eg. 2000" 
                        v-model="$data.form.amount"                        
                    />
                    <p v-show="has($data.errors,'amount')" class="text-danger mb-0">{{ $data.errors.amount }}</p>              
                </CCol> 
                <CCol md="12" class="py-2">
                    <CFormSelect label="Expense Type" aria-label="Expense Type" v-model="$data.form.type">
                        <option>Select Expense Type*</option>
                        <option v-for="(type,index) in $data.types" :key="index" :value="type.id">{{ type.name }}</option>
                    </CFormSelect>
                    <p v-show="has($data.errors,'type')" class="text-danger mb-0">{{ $data.errors.type }}</p>              
                </CCol> 
                <CCol md="12" class="py-2">
                    <CFormTextarea                    
                        label="Description"
                        placeholder="eg. Describe this expense (Optional)"
                        v-model="$data.form.description"                        
                    />
                    <p v-show="has($data.errors,'description')" class="text-danger mb-0">{{ $data.errors.description }}</p>              
                </CCol>                                                                                               
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
import { CSpinner } from '@coreui/vue';
import { cloneDeep, each, has, isEmpty } from 'lodash';
import { computed, defineEmits, defineProps, inject, reactive, watch } from 'vue';
import { number, object, string } from 'yup';
import moment from 'moment';

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
    form: {
        amount:         0,
        date:           "",
        description:    "",
        name:           "",
        transaction_id: "",
        type:           "",
    },
    loading: Boolean(),
    isDisabled: Boolean(),
    types: []
});

const formSchema: any = object().shape({
    amount:         number().min(1,'*Amount must be greater than 0').required("*Amoung is required"),
    date:           string().required("*Date is required"),
    description:    string().optional(),
    name:           string().required("*Name is required"),
    transaction_id: string().optional(),
    type:           string().required("*Expense Type is required"),
});

/**
 * Update the phone number in the form data.
 *
 * @param {Event|String} $event - The event object or the phone number.
 * @return {void}
 */
const getPhoneNumber = ($event: any) => {
    // Check if the event is a string or not.
    // If it's a string, assign it to the phone number field.
    // If it's an event object, assign the value of the target to the phone number field.
    $data.form.phone_number = $event.constructor == String ? $event : $event.target.value 
}

const resetForm = () => {
    $data.types = [];
    $data.form  = {
        amount:         0,
        date:           "",
        description:    "",
        name:           "",
        transaction_id: "",
        type:           "",
    }
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        await $api.post('/expenses',cloneDeep($data.form));
        // Toast show message
        $toast.success($i18n.t('expenses.messages.success.created'));    
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

const fetchExpenseTypes = async () => {
    try {
        // Fetch the socities from the backend
        const { data: { types } } = await $api.get('/expense-types/fetch');
        // Assign data
        $data.types = types;
    } catch(error) {
        // Catch any errors that may occur and set the loader to false
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
        // Check if 'show' is true
        if(value) {
            fetchExpenseTypes();
        }

        // Check if 'show' is false
        if (!value) {
            // Reset the form when 'show' is false
            resetForm();
        }
    }
);
</script>