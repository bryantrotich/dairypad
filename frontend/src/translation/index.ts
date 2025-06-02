import { createI18n } from "vue3-i18n";
import en from "./en";

export default {
    install: (app: any) => {
        const i18n = createI18n({
            locale: "en",
            messages: {
                en
            },
        });
        app.provide('$i18n', i18n);
        app.config.globalProperties.$i18n = i18n;
    }
}