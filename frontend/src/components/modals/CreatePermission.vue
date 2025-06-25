<template>
   <CModal backdrop="static" :visible="modal" alignment="center" @close="modal = false">
        <CForm @submit.prevent="save">
            <CModalHeader>
                <CModalTitle>Create Permission</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CCol md="12" class="py-2">
                    <CFormSelect label="Action" aria-label="Action" v-model="$data.form.action">
                        <option>Select Action*</option>
                        <option v-for="(action,index) in $props.actions" :key="index" :value="action.value">{{ action.name }}</option>
                    </CFormSelect>
                    <p v-show="has($data.errors,'action')" class="text-danger mb-0">{{ $data.errors.action }}</p>              
                </CCol>                  
                <CCol md="12" class="py-2">
                    <CFormSelect label="Role" aria-label="Expense Type" v-model="$data.form.module">
                        <option>Select Module*</option>
                        <option v-for="(module,index) in $props.modules" :key="index" :value="module.value">{{ module.name }}</option>
                    </CFormSelect>
                    <p v-show="has($data.errors,'module')" class="text-danger mb-0">{{ $data.errors.module }}</p>              
                </CCol>                
                <CCol md="12" class="py-2">
                    <CFormTextarea                    
                        label="Description"
                        placeholder="eg. Describe the type of expense"
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

const $props: any = defineProps({
    actions: {
        default: [],
        type:    Array
    },
    modules: {
        default: [],
        type:    Array
    },
    show: {
        default: Boolean(),
        type:    Boolean
    }
});

const $data: any = reactive({
    errors: {},
    form: {
        description:  "",
        module:       "",
        action:       "",
    },
    loading: Boolean(),
    isDisabled: Boolean(),
});

const formSchema: any = object().shape({
    description:  string().required("*Description is required"),
    module:       string().required("*Module is required"),
    action:       string().required("*Action is required"),
});

const resetForm = () => {
    $data.form = {
        description:  "",
        module:       "",
        action:       "",
    }
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        await $api.post('/permissions',cloneDeep($data.form));
        // Toast show message
        $toast.success('Permission has been created.');    
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