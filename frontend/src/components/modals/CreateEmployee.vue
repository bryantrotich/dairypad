<template>
   <CModal backdrop="static" :visible="modal" alignment="center" @close="modal = false" >
        <CForm @submit.prevent="save">
            <CModalHeader>
                <CModalTitle>Create Employee</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="text"
                            label="First Name"
                            placeholder="eg. John Doe"
                            v-model="$data.form.first_name"
                        />
                        <p v-show="has($data.errors,'first_name')" class="text-danger mb-0">{{ $data.errors.first_name }}</p>              
                    </CCol>  
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="text"
                            label="Last Name"
                            placeholder="eg. John Doe"
                            v-model="$data.form.last_name"
                        />
                        <p v-show="has($data.errors,'last_name')" class="text-danger mb-0">{{ $data.errors.last_name }}</p>              
                    </CCol>  
                    <CCol md="12" class="py-2">
                        <CFormInput
                            type="email"
                            label="Email Address"
                            placeholder="eg. john@example.com"
                            v-model="$data.form.email"
                        />
                        <p v-show="has($data.errors,'email')" class="text-danger mb-0">{{ $data.errors.email }}</p>              
                    </CCol>  
                    <CCol md="12" class="py-2">
                        <CFormSelect label="Role" aria-label="Expense Type" v-model="$data.form.role">
                            <option>Select Role*</option>
                            <option v-for="(role,index) in $data.roles" :key="index" :value="role.id">{{ role.name }}</option>
                        </CFormSelect>
                        <p v-show="has($data.errors,'role')" class="text-danger mb-0">{{ $data.errors.role }}</p>              
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
import { computed, defineEmits, defineProps, inject, reactive, watch } from 'vue';
import { object, string } from 'yup';

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
        first_name: "",
        last_name:  "",
        email:      "",
        role:       "",
    },
    loading: Boolean(),
    isDisabled: Boolean(),
    roles: []
});

const formSchema: any = object().shape({
    first_name:     string().required("*First Name is required"),
    last_name:      string().required("*Last Name is required"),
    email:          string().required("*Email is required"),
    role:           string().required("*Role is required"),
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
        first_name: "",
        last_name:  "",
        email:      "",
        role:       "",
    }
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        const { data: { customer } } = await $api.post('/employees',cloneDeep($data.form));
        // Toast show message
        $toast.success($i18n.t('employees.messages.success.created'));    
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
const fetchRoles = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the roles from the backend
        const { data: { roles } } = await $api.get('/roles/fetch');  
        // Set the roles to the data fetched from the backend
        $data.roles = roles;
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
            fetchRoles();
        }

        // Check if 'show' is false
        if (!value) {
            // Reset the form when 'show' is false
            resetForm();
        }
    }
);
</script>