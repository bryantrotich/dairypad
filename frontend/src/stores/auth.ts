import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { isNull } from 'lodash';
import { useStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {

    window.addEventListener('storage', (event) => {
        console.log(event);
    });

    const { VITE_APP_NAME } = import.meta.env;
    const data              = ref({});

    const auth: any         = useStorage(
        `${VITE_APP_NAME.replaceAll(' ','').toLowerCase()}`, 
        data, 
        localStorage,
        {
            serializer: {
                read:  (value: any) => value ? JSON.parse(atob(value)) : null,
                write: (value: any) => btoa(JSON.stringify(value)),
            },
        },
    );
    
    /**
     * Sets the authentication data
     * 
     * @param {Object} data - The authentication data containing the user and token
     */
    const login = async(data: any) => {
        /**
         * Stores the authentication data in local storage
         * 
         * @param {Object} data - The authentication data containing the user and token
         */
        // await auth.value = data;
        auth.value = data;
    }

    /**
     * Clears the authentication data from local storage
     */
    const logout = () => {

        /**
         * Removes the authentication data from local storage
         */
        auth.value = {}
    }

    return { auth: auth.value, login, logout }

});
