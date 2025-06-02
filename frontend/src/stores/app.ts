import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {

    return reactive({
        loader: Boolean()
    });

});
