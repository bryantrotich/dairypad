<template>
    <Guest>
        <CCol :lg="4" :md="5" :sm="10" :xs="12">
            <CCardGroup>
                <CCard class="p-4">
                    <CCardBody>
                        <CForm @submit.prevent="submit">
                            <CCol :xs="12">
                                <h1>Login</h1>
                                <p class="text-body-secondary">Sign In to your account</p>
                            </CCol>
                            <CCol class="mb-3">
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon="cil-user" />
                                    </CInputGroupText>
                                    <CFormInput
                                        placeholder="Email Address"
                                        autocomplete="off"
                                        type="email"
                                        name="email"
                                        v-model="$data.form.email"
                                        :invalid="has($data.errors,'email')"
                                    />
                                </CInputGroup>
                                <p v-show="has($data.errors,'email')" class="text-danger">{{ $data.errors.email }}</p>   
                            </CCol>           
                            <CCol class="mb-2">
                                <CInputGroup>
                                    <CInputGroupText>
                                        <CIcon icon="cil-lock-locked" />
                                    </CInputGroupText>
                                    <CFormInput
                                        type="password"
                                        placeholder="Password"
                                        autocomplete="off"
                                        name="password"
                                        v-model="$data.form.password"
                                        :invalid="has($data.errors,'password')"
                                    />
                                </CInputGroup>
                                <p v-show="has($data.errors,'password')" class="text-danger">{{ $data.errors.password }}</p>   
                            </CCol>           
                            <CCol md="12">
                                <CButton color="link"    class="px-0">Forgot password?</CButton>
                                <CButton color="primary" class="px-4 col-12" type="submit" :disabled="$data.isDisabled || $data.loader">
                                    <CSpinner size="sm" v-if="$data.loader"/> 
                                    Login 
                                </CButton>
                            </CCol>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCardGroup>
        </CCol>
    </Guest>
</template>
<script setup lang="ts">
import { Guest } from '@/components';
import { cloneDeep, each, has, isEmpty } from 'lodash';
import { computed, inject, reactive, watch} from 'vue';
import * as yup from 'yup';
import { useAuthStore } from '@/stores';
import { useRouter } from 'vue-router';

const $api:   any = inject('$api');
const $toast: any = inject('$toast');
const $i18n:  any = inject('$i18n');
const $data:  any = reactive({
    errors: Object(), 
    form: {
        email:    String(),
        password: String(),
    },
    isDisabled: Boolean(true),
    loader:     Boolean() 
});
const $router: any = useRouter();

const formSchema: any = yup.object().shape({
	email:    yup.string().email("*Enter a valid email address").required("*Email address is required"),
	password: yup.string().required("*Password is required").test( value => !isEmpty(value) ? true : '*Password is required'),
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
        $data.loader = true;

        const authStore = useAuthStore();

        // Validate the entire form before submission
        const { data: { token, user, permissions } } = await $api.post('auth/login', cloneDeep($data.form));

        authStore.login({token, user, permissions});

        $toast.success($i18n.t('login.messages.success.authenticated'));

        $router.push({ path: '/' });
        
    } catch(error: any) {
        console.log(error);
        $data.loader = false;

        if( error.status == 404 ){
            $toast.error($i18n.t('login.messages.error.notfound'));
        }

        if( error.status == 401 ){
            $toast.error($i18n.t('login.messages.error.unauthorized'));
        }        

    } finally {
        $data.loader = false;
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
</script>
