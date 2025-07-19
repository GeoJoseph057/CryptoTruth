import { I18n } from './I18n';
export type Locale = 'ar' | 'ar-AR' | 'en' | 'en-US' | 'es' | 'es-419' | 'fr' | 'fr-FR' | 'hi' | 'hi-IN' | 'id' | 'id-ID' | 'ja' | 'ja-JP' | 'ko' | 'ko-KR' | 'pt' | 'pt-BR' | 'ru' | 'ru-RU' | 'th' | 'th-TH' | 'tr' | 'tr-TR' | 'ua' | 'uk-UA' | 'zh' | 'zh-CN';
export declare const i18n: I18n;
export declare function setLocale(locale: Locale): Promise<void>;
