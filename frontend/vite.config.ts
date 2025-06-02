import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "url";
import vueDevTools from 'vite-plugin-vue-devtools'
import _ from 'lodash';

export default defineConfig( ({command,mode}) => {

  _.set(import.meta,'env',loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      vue(),
      vueDevTools()
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./public", import.meta.url)),
        "^": fileURLToPath(new URL("./node_modules", import.meta.url)),
      },
    },
    server:{
      proxy: {
        '/api/v1': import.meta.env.VITE_API_URL
      },
    }    
  }
})
