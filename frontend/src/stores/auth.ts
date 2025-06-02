import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { isNull } from 'lodash';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {

    const { VITE_APP_NAME } = import.meta.env;
    const session           = localStorage.getItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`);
    const $router           = useRouter();

    const auth = computed({
        get: ()      => Object.assign({}, !isNull(session) ? JSON.parse(atob(session)) :  {} ),
        set: (value) => localStorage.setItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`, btoa(JSON.stringify(value))) 
    })
    
    /**
     * Sets the authentication data
     * 
     * @param {Object} data - The authentication data containing the user and token
     */
    const login = (data: any) => {
        /**
         * Stores the authentication data in local storage
         * 
         * @param {Object} data - The authentication data containing the user and token
         */
        auth.value = data;

        // Redirect to home page
        $router.push({ name: 'Overview' });        
    }

    /**
     * Clears the authentication data from local storage
     */
    const logout = () => {

        /**
         * Removes the authentication data from local storage
         */
        localStorage.removeItem(`${VITE_APP_NAME.replaceAll(' ','')}_AUTH`);

        //Redirect to login page
        $router.push({ name: 'Login' });
    }

    return { auth: auth.value, login, logout }

});
