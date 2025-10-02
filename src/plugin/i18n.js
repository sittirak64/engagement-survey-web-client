import Vietnam from "/src/language/Vietnam.json";
import Cambodia from "/src/language/Cambodia.json";
import Indian from "/src/language/Indian.json";
import English from "/src/language/English.json";
import Thai from "/src/language/Thai.json";
import China from "/src/language/China.json";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  legacy: false,
  locale: sessionStorage.getItem("defaultLanguage"),
  messages: {
    en: English,
    th: Thai,
    hi: Indian,
    km: Cambodia,
    vi: Vietnam,
    zh: China
  },
});
export default i18n;
