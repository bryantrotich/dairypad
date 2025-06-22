import { ref, computed, watch, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useStorage, useStorageAsync } from '@vueuse/core';
import { useSidebarStore } from './sidebar';

export const useAuthStore = defineStore('auth', () => {

    const storeLinks        = useSidebarStore();
    const { VITE_APP_NAME } = import.meta.env;
    const data              = reactive({ auth: {}, storage: {}});
    const auth              = computed( () => data.auth);

    const storage: any         = useStorage(
        `${VITE_APP_NAME.replaceAll(' ','').toLowerCase()}`, 
        data.storage, 
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
        storage.value = data;
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
        storage.value = data;
    }

    /**
     * Clears the authentication data from local storage
     */
    const logout = () => {

        /**
         * Removes the authentication data from local storage
         */
        storage.value = {}
    }

    watch(
        () => storage.value,
        (value) => { 
            data.auth = value;
        },
        { deep: true, immediate: true }
    )

    return { auth, links: links.value, login, logout, update }

});
