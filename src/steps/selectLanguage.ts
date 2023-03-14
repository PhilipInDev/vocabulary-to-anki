import prompts from "prompts";

interface Lang {
  title: string;
  value: string;
}

const langs: Lang[] = [
  { title: "Afrikaans", value: "af" },
  { title: "Albanian", value: "sq" },
  { title: "Amharic", value: "am" },
  { title: "Arabic", value: "ar" },
  { title: "Armenian", value: "hy" },
  { title: "Assamese", value: "as" },
  { title: "Aymara", value: "ay" },
  { title: "Azerbaijani", value: "az" },
  { title: "Bambara", value: "bm" },
  { title: "Basque", value: "eu" },
  { title: "Belarusian", value: "be" },
  { title: "Bengali", value: "bn" },
  { title: "Bhojpuri", value: "bho" },
  { title: "Bosnian", value: "bs" },
  { title: "Bulgarian", value: "bg" },
  { title: "Catalan", value: "ca" },
  { title: "Cebuano", value: "ceb" },
  { title: "Chinese (Simplified)", value: "zh-CN" },
  { title: "Chinese (Traditional)", value: "zh-TW" },
  { title: "Corsican", value: "co" },
  { title: "Croatian", value: "hr" },
  { title: "Czech", value: "cs" },
  { title: "Danish", value: "da" },
  { title: "Dhivehi", value: "dv" },
  { title: "Dogri", value: "doi" },
  { title: "Dutch", value: "nl" },
  { title: "English", value: "en" },
  { title: "Esperanto", value: "eo" },
  { title: "Estonian", value: "et" },
  { title: "Ewe", value: "ee" },
  { title: "Filipino (Tagalog)", value: "fil" },
  { title: "Finnish", value: "fi" },
  { title: "French", value: "fr" },
  { title: "Frisian", value: "fy" },
  { title: "Galician", value: "gl" },
  { title: "Georgian", value: "ka" },
  { title: "German", value: "de" },
  { title: "Greek", value: "el" },
  { title: "Guarani", value: "gn" },
  { title: "Gujarati", value: "gu" },
  { title: "Haitian Creole", value: "ht" },
  { title: "Hausa", value: "ha" },
  { title: "Hawaiian", value: "haw" },
  { title: "Hebrew", value: "he" },
  { title: "Hindi", value: "hi" },
  { title: "Hmong", value: "hmn" },
  { title: "Hungarian", value: "hu" },
  { title: "Icelandic", value: "is" },
  { title: "Igbo", value: "ig" },
  { title: "Ilocano", value: "ilo" },
  { title: "Indonesian", value: "id" },
  { title: "Irish", value: "ga" },
  { title: "Italian", value: "it" },
  { title: "Japanese", value: "ja" },
  { title: "Javanese", value: "jv" },
  { title: "Kannada", value: "kn" },
  { title: "Kazakh", value: "kk" },
  { title: "Khmer", value: "km" },
  { title: "Kinyarwanda", value: "rw" },
  { title: "Konkani", value: "gom" },
  { title: "Korean", value: "ko" },
  { title: "Krio", value: "kri" },
  { title: "Kurdish", value: "ku" },
  { title: "Kurdish (Sorani)", value: "ckb" },
  { title: "Kyrgyz", value: "ky" },
  { title: "Lao", value: "lo" },
  { title: "Latin", value: "la" },
  { title: "Latvian", value: "lv" },
  { title: "Lingala", value: "ln" },
  { title: "Lithuanian", value: "lt" },
  { title: "Luganda", value: "lg" },
  { title: "Luxembourgish", value: "lb" },
  { title: "Macedonian", value: "mk" },
  { title: "Maithili", value: "mai" },
  { title: "Malagasy", value: "mg" },
  { title: "Malay", value: "ms" },
  { title: "Malayalam", value: "ml" },
  { title: "Maltese", value: "mt" },
  { title: "Maori", value: "mi" },
  { title: "Marathi", value: "mr" },
  { title: "Meiteilon (Manipuri)", value: "mni-Mtei" },
  { title: "Mizo", value: "lus" },
  { title: "Mongolian", value: "mn" },
  { title: "Myanmar (Burmese)", value: "my" },
  { title: "Nepali", value: "ne" },
  { title: "Norwegian", value: "no" },
  { title: "Nyanja (Chichewa)", value: "ny" },
  { title: "Odia (Oriya)", value: "or" },
  { title: "Oromo", value: "om" },
  { title: "Pashto", value: "ps" },
  { title: "Persian", value: "fa" },
  { title: "Polish", value: "pl" },
  { title: "Portuguese (Portugal, Brazil)", value: "pt" },
  { title: "Punjabi", value: "pa" },
  { title: "Quechua", value: "qu" },
  { title: "Romanian", value: "ro" },
  { title: "Russian", value: "ru" },
  { title: "Samoan", value: "sm" },
  { title: "Sanskrit", value: "sa" },
  { title: "Scots (Gaelic)", value: "gd" },
  { title: "Sepedi", value: "nso" },
  { title: "Serbian", value: "sr" },
  { title: "Sesotho", value: "st" },
  { title: "Shona", value: "sn" },
  { title: "Sindhi", value: "sd" },
  { title: "Sinhala (Sinhalese)", value: "si" },
  { title: "Slovak", value: "sk" },
  { title: "Slovenian", value: "sl" },
  { title: "Somali", value: "so" },
  { title: "Spanish", value: "es" },
  { title: "Sundanese", value: "su" },
  { title: "Swahili", value: "sw" },
  { title: "Swedish", value: "sv" },
  { title: "Tagalog (Filipino)", value: "tl" },
  { title: "Tajik", value: "tg" },
  { title: "Tamil", value: "ta" },
  { title: "Tatar", value: "tt" },
  { title: "Telugu", value: "te" },
  { title: "Thai", value: "th" },
  { title: "Tigrinya", value: "ti" },
  { title: "Tsonga", value: "ts" },
  { title: "Turkish", value: "tr" },
  { title: "Turkmen", value: "tk" },
  { title: "Twi (Akan)", value: "ak" },
  { title: "Ukrainian", value: "uk" },
  { title: "Urdu", value: "ur" },
  { title: "Uyghur", value: "ug" },
  { title: "Uzbek", value: "uz" },
  { title: "Vietnamese", value: "vi" },
  { title: "Welsh", value: "cy" },
  { title: "Xhosa", value: "xh" },
  { title: "Yiddish", value: "yi" },
  { title: "Yoruba", value: "yo" },
  { title: "Zulu", value: "zu" },
];

async function selectLanguage(message: string) {
  const { lang } = await prompts({
    type: "autocomplete",
    name: "lang",
    message,
    choices: langs.map((lang) => ({ ...lang, value: lang })),
    initial: "en",
  });

  return lang as Lang;
}

export { selectLanguage };
