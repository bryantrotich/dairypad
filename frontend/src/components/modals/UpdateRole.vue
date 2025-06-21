<template>
    <COffcanvas placement="end" :visible="modal" @hide="modal = false">
        <COffcanvasHeader class="flex-column flex-grow-1">
            <CCol md="12" class="d-flex justify-content-between">
                <COffcanvasTitle>Edit Role</COffcanvasTitle>
                <CCloseButton class="text-reset" :disabled="$data.loading" @click="modal = false"/>                       
            </CCol>     
            <CCol md="12">
                <CButton class="w-100" color="primary" type="button" @click="save" :disabled="$data.isDisabled" >
                    <CSpinner v-show="$data.loading" size="sm"/>
                    Save changes
                </CButton>                      
            </CCol>                         
        </COffcanvasHeader>
        <COffcanvasBody>
            <CRow>
                <CCol md="12" class="mb-4">
                    <CFormInput
                        type="text"
                        label="Name"
                        placeholder="eg. Name expense type"
                        v-model="$data.form.name"
                    />
                    <p v-show="has($data.errors,'name')" class="text-danger mb-0">{{ $data.errors.name }}</p>              
                </CCol>  
                <CCol md="12">
                    <h5 class="mb-0"> <CFormCheck label="Select Permissions" @change="selectAll"/></h5>
                    <p v-show="has($data.errors,'permissions')" class="text-danger mb-0">{{ $data.errors.permissions }}</p>                                     
                    <CCard  v-for="(permissions,key) of permissions" class="my-2">
                        <CCardHeader>
                            <p class="mb-0">
                                <CFormCheck :value="key" @change="selectCategory" />
                                <strong class="mx-2">{{ capitalize(String(key)) }}</strong>
                            </p>
                        </CCardHeader>
                        <CCardBody>
                            <template v-for="(permission,index) in permissions">
                                <CFormCheck :label="permission.name" :value="permission.id" :name="key" v-model="$data.form.permissions"/>
                            </template>                                    
                        </CCardBody>
                    </CCard>                    
                </CCol>                               
            </CRow> 
        </COffcanvasBody>
    </COffcanvas>
</template>    
<script setup lang="ts">
import { capitalize, cloneDeep, each, groupBy, has, isEmpty } from 'lodash';
import { computed, defineEmits, defineProps, inject, reactive, watch } from 'vue';
import { array, object, string } from 'yup';

const $api:   any = inject('$api');
const $toast: any = inject('$toast');
const $i18n:  any = inject('$i18n');
const $emit:  any = defineEmits(['fetch','close']);
const $data:  any = reactive({
    errors: {},
    form: {
        permissions:  [],
        name:         "",
    },
    loading:    Boolean(),
    isDisabled: Boolean(),
    permissions: []
});
const modal: any  = computed({
    get: ()      => $props.show,
    set: (value) => $emit('close', value)
});
const $props: any = defineProps({
    data: {
        default: () => Object(),
        type:    Object
    },    
    show: {
        default: Boolean(),
        type:    Boolean
    }
});
const permissions = computed( () => groupBy($data.permissions,'module') );
const formSchema: any = object().shape({
    permissions:  array().min(1,"*Select at least one permission").required("*Permissions is required"),
    name:         string().required("*Name is required"),
});


/**
 * Resets the form to its default values.
 *
 * @return {void}
 */
const resetForm = () => {
    // Reset the form by setting the default values.
    $data.form = {
        permissions:  [],  // Reset the permissions array.
        name:         "",  // Reset the name field.
    }
}

/**
 * Updates the form with the role's data.
 *
 * @return {void}
 */
const updateForm = () => {
    // Update the form with the role's data
    $data.form.name        = $props.data.name;
    $data.form.permissions = cloneDeep($props.data.permissions).map( (permission: any) => permission.id );
}

const save = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the socities from the backend
        await $api.put(`/roles/${$props.data.id}/update`,cloneDeep($data.form));
        // Toast show message
        $toast.success($i18n.t('roles.messages.success.created'));    
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
 * Fetch all the permissions from the backend.
 * 
 * This function fetches all the permissions from the backend and assigns them to the data.permissions property.
 * It also sets the loader to true while the data is being fetched and false when the data has finished fetching.
 * 
 * @return {void}
 */
const fetchPermissions = async () => {
    try {
        // Set the loader to true so that the user knows that the data is being fetched.
        $data.loading = true;
        // Fetch the permissions from the backend
        const { data: { permissions } } = await $api.get('/permissions/fetch');  
        // Set the permissions to the data fetched from the backend
        $data.permissions = permissions;
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


const selectAll = ({ target: { checked }}: any) => {
    if( checked ){
        $data.form.permissions = cloneDeep($data.permissions).map( (permission: any) => permission.id );
    }

    if( !checked ){
        $data.form.permissions.splice(0);
    }
}

const selectCategory = ({ target: { checked, value }}: any) => {
    let selected = cloneDeep(permissions.value[value]).map( (permission: any) => permission.id );

    if( checked ){
        $data.form.permissions.push(...selected)
    }

    if( !checked ){
        $data.form.permissions = $data.form.permissions.filter( (permission: any) => !selected.includes(permission) );
    }
}

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
            updateForm();
            fetchPermissions();
        }
        // Check if 'show' is false
        if (!value) {
            // Reset the form when 'show' is false
            resetForm();
        }
    }
);

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

</script>