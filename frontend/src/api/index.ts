import axios from 'axios';
import { isEmpty } from 'lodash';
import { useAuthStore, useEnvStore } from '@/stores';

export default {
    install: (app: any) => {
        
        // State variables
        const { VITE_API_URL } = useEnvStore();
        const { auth }         = useAuthStore();

        // Init axios
        const api = axios.create({
            baseURL: `${VITE_API_URL}/api/v1`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        });

        if( !isEmpty(auth) ){
            const { type, code } = auth.token;
            api.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = `${type} ${code}`;
                    return config;
                },
                error => Promise.reject(error)
            );
        }

        // api.interceptors.response.use(
        //     response => response,
        //     (error) => {
        //         if (error.response.status === 401) {
        //             // console.debug('[Bekreftelser] Intercepting api response');
        //             // store.commit('auth',{});
        //             // sessionStorage.clear();
        //             // window.location.href = VUE_APP_API_BASE_URL.replace('api', '');
        //         }
        //         return Promise.reject(error);
        //     }
        // );
        app.provide('$api', api);
        app.config.globalProperties.$api = api;
    }
}
