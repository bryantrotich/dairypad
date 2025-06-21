import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { groupBy, isNull } from 'lodash';
import { useStorage } from '@vueuse/core';
import { useSidebarStore } from './sidebar';

export const useAuthStore = defineStore('auth', () => {

    const storeLinks        = useSidebarStore();
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

    const links = computed( () => storeLinks);

    // const links             = computed( 
    //     () => storeLinks.map( 
    //         group => {
    //             return {
    //                 ...group,
    //                 children: group.children.filter(
    //                     (link: any) => link.permissions.every( 
    //                         (permission: any) => auth.value.permissions.includes(permission) 
    //                     )        
    //                 ) 
    //             };
    //         }
    //     ) 
    // );

    /**
     * Updates the authentication data in local storage
     * 
     * @param {Object} data - The authentication data containing the user and token
     * 
     * @returns {Promise<void>} - A promise that resolves when the authentication data has been updated
     */
    const update = async(data: any): Promise<void> => {
        /**
         * Stores the authentication data in local storage
         * 
         * @param {Object} data - The authentication data containing the user and token
         */
        auth.value = data;
    }
    
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

    return { auth: auth.value, links: links.value, login, logout, update }

});
