<template>
    <Guest>
        <CCol lg="4" md="5" sm="10" xs="12">
            <CCard class="p-2">
                <CCardBody>
                    <CForm @submit.prevent="submit">
                        <CCol :xs="12">
                            <h2>Set Password</h2>
                            <p class="text-body-secondary">Set the account password</p>
                        </CCol>
                        <CCol class="mb-3">
                            <CInputGroup>
                                <CInputGroupText>
                                    <CIcon icon="cil-lock-locked" />
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Password"
                                    autocomplete="off"
                                    type="password"
                                    name="password"
                                    v-model="$data.form.password"
                                    :invalid="has($data.errors,'password')"
                                />
                            </CInputGroup>
                            <p v-show="has($data.errors,'password')" class="text-danger">{{ $data.errors.password }}</p>   
                        </CCol>           
                        <CCol class="mb-2">
                            <CInputGroup>
                                <CInputGroupText>
                                    <CIcon icon="cil-lock-locked" />
                                </CInputGroupText>
                                <CFormInput
                                    type="password"
                                    placeholder="Confirm Password"
                                    autocomplete="off"
                                    name="password"
                                    v-model="$data.form.confirm_password"
                                    :invalid="has($data.errors,'confirm_password')"
                                />
                            </CInputGroup>
                            <p v-show="has($data.errors,'confirm_password')" class="text-danger">{{ $data.errors.confirm_password }}</p>   
                        </CCol>           
                        <CCol md="12" class="mt-4">
                            <CButton color="primary" class="px-4 col-12" type="submit" :disabled="$data.isDisabled || $data.loaders.set">
                                <CSpinner size="sm" v-if="$data.loaders.set"/> 
                                Set Password 
                            </CButton>
                        </CCol>
                    </CForm>
                </CCardBody>
            </CCard>
        </CCol>
    </Guest>
</template>
<script setup lang="ts">
import { Guest } from '@/components';
import { cloneDeep, each, has, isEmpty} from 'lodash';
import { onBeforeMount, inject, reactive, watch } from 'vue';
import { string, object, ref } from 'yup';
import { useRouter, useRoute } from 'vue-router';

const $api:    any = inject('$api');
const $toast:  any = inject('$toast');
const $router: any = useRouter();
const $data:   any = reactive({
    errors: Object(),
    form: {
        confirm_password: String(),
        password:         String(),
    },
    isDisabled: Boolean(true),
    loaders: {
        fetch: Boolean(false),
        set:   Boolean(false),
    } 
});

const formSchema: any = object().shape({
	confirm_password:  string().required("*Confirmation password is required").oneOf([ref('password'), null], 'Passwords must match'),
	password:          string().min(8,'*Your password is short').required("*Password is required").test( value => !isEmpty(value) ? true : '*Password is required'),
});

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
 * Submits the login form.
 *
 * Posts the form data to the `login` route and resets the password field
 * on success.
 */
const submit = async () => {
    try {
        $data.loaders.set = true;
        // Validate the entire form before submission
        await $api.post(`auth/set/${$data.token}/password`, cloneDeep($data.form));
        $toast.success('Your password has been successfully set.');
        $router.push({ name: 'Login' });
    } catch(error: any) {
        $data.loaders.set  = false;      
    } finally {
        $data.loaders.set  = false;
    }
};

/**
 * Submits the login form.
 *
 * Posts the form data to the `login` route and resets the password field
 * on success.
 */
const checkToken = async () => {
    try {
        $data.loaders.fetch = true;

        const { params: { token } } = useRoute();

        // Validate the entire form before submission
        const { data: { token: new_token } } = await $api.put(`auth/verify/${token}`);

        $data.token = new_token;
        
    } catch(error: any) {
        $data.loaders.fetch  = false;    
    } finally {
        $data.loaders.fetch  = false;
    }
};

watch(
	() => $data.form, 
	(form) => {
		each(form,(value,key) => {
			validateForm(key);
		});
	},
	{ 
		deep: true, immediate: false
	}
);

onBeforeMount( () => checkToken());

</script>
