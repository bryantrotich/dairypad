<template>
   <CModal backdrop="static" :visible="modal" alignment="center" @close="modal = false" size="lg">
        <CForm @submit.prevent="save">
            <CModalHeader>
                <CModalTitle>Create Customer</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol md="6" class="py-2">
                        <CFormInput
                            type="text"
                            label="Name"
                            placeholder="eg. John Doe"
                            v-model="$data.form.name"
                        />
                        <p v-show="has($data.errors,'name')" class="text-danger mb-0">{{ $data.errors.name }}</p>              
                    </CCol>
                    <CCol md="6" class="py-2">
                        <label for="phone">Phone Number</label>
                        <VueTelInput 
                            @input="getPhoneNumber" 
                            defaultCountry="KE" 
                            :inputOptions="{ styleClasses: 'form-control m-0', placeholder: 'Phone Number' }" 
                            mode="international"
                        />
                        <p v-show="has($data.errors,'phone_number')" class="text-danger mb-0">{{ $data.errors.phone_number }}</p>              
                    </CCol>    
                    <CCol md="6" class="py-2">
                        <CFormInput
                            type="text"
                            label="Contact Person"
                            placeholder="eg. Jane Doe (optional)"
                            v-model="$data.form.contact_person"
                        />
                        <p v-show="has($data.errors,'contact_person')" class="text-danger mb-0">{{ $data.errors.contact_person }}</p>              
                    </CCol>
                    <CCol md="6" class="py-2">
                        <CFormInput
                            type="text"
                            label="Address"
                            placeholder="eg. Westlands, Nairobi (optional)"
                            v-model="$data.form.address"
                        />
                        <p v-show="has($data.errors,'address')" class="text-danger mb-0">{{ $data.errors.address }}</p>              
                    </CCol>
                    <CCol md="6" class="py-2">
                        <CFormInput
                            type="text"
                            label="Postal Code"
                            placeholder="eg. 10001 (optional)"
                            v-model="$data.form.postal_code"
                        />
                        <p v-show="has($data.errors,'postal_code')" class="text-danger mb-0">{{ $data.errors.postal_code }}</p>              
                    </CCol>
                    <CCol md="6" class="py-2">
                        <CFormInput
                            type="text"
                            label="Town"
                            placeholder="eg. Nairobi (optional)"
                            v-model="$data.form.town"
                        />
                        <p v-show="has($data.errors,'town')" class="text-danger mb-0">{{ $data.errors.town }}</p>              
                    </CCol>                                                                                                                   
                    <CCol md="6" class="py-2">
                        <CFormSelect label="Billing Cycle" aria-label="Billing Cycle" v-model="$data.form.billing_cycle">
                            <option>Select Billing Cycle*</option>
                            <option v-for="(status,index) in $data.billing_cycle" :key="index" :value="status.value">{{ status.label }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'billing_cycle')" class="text-danger mb-0">{{ $data.errors.billing_cycle }}</p>              
                    </CCol>   
                    <CCol md="6" class="py-2">
                        <CFormSelect label="Type" aria-label="Type" v-model="$data.form.type">
                            <option>Select Type*</option>
                            <option v-for="(status,index) in $data.type" :key="index" :value="status.value">{{ status.label }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'type')" class="text-danger mb-0">{{ $data.errors.type }}</p>              
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
import { CSpinner } from '@coreui/vue';
import { cloneDeep, each, has, isEmpty } from 'lodash';
import { computed, defineEmits, defineProps, inject, reactive, watch } from 'vue';
import { object, string } from 'yup';
import { VueTelInput } from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

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
        address:        "",
        billing_cycle:  "",
        contact_person: "",
        name:           "",
        phone_number:   "",
        postal_code:    "",
        town:           "",
        type:           "",
    },
    type: [
        { label: "Cash", value: "cash" },
        { label: "Account", value: "account" },
    ],
    billing_cycle: [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
    ],
    loading: Boolean(),
    isDisabled: Boolean(),
});

const formSchema: any = object().shape({
    address:        string().optional(),
    billing_cycle:  string().required("*Billing Cycle is required"),
    contact_person: string().optional(),
    name:           string().required("*Name is required"),
    postal_code:    string().optional(),
    phone_number:   string().required("*Phone Number is required").matches(/^\+\d{3}\s\d{3}\s\d{6}$/, "*Invalid phone number"),
    town:           string().optional(),
    type:           string().required("*Type is required"),
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
    $data.form = {
        city:         "",
        email:        "",
        name:         "",
        phone_number: "",
    }
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        const { data: { society } } = await $api.post('/customers',cloneDeep($data.form));
        // Toast show message
        $toast.success($i18n.t('customers.messages.success.created'));    
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
        // Check if 'show' is false
        if (!value) {
            // Reset the form when 'show' is false
            resetForm();
        }
    }
);
</script>