import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ta from "./ta.json";
import hi from "./hi.json";

// ✅ Safe normalization function
const normalizeKey = (key) => {
  if (typeof key !== "string") return "";
  return key.trim().toLowerCase().replace(/\s+/g, "_");
};

// ✅ Custom postProcessor plugin
const normalizeKeysPlugin = {
  type: "postProcessor",
  name: "normalizeKeys",
  process(value, key, options, translator) {
    // Skip invalid keys
    if (typeof key !== "string") return value;

    const normalized = normalizeKey(key);
    const lang = translator.language;
    const translations = translator.store?.data?.[lang]?.translation;

    // If normalized key exists in the translation file, return its value
    if (translations && translations[normalized]) {
      return translations[normalized];
    }

    // Otherwise, return the original value or key
    return value || key;
  },
};

i18n
  .use(initReactI18next)
  .use(normalizeKeysPlugin)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      hi: { translation: hi },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    postProcess: ["normalizeKeys"], // 👈 activate plugin
  });

export default i18n;
