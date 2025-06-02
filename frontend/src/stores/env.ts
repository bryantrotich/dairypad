import { defineStore } from 'pinia'

export const useEnvStore = defineStore('env', () => import.meta.env);
