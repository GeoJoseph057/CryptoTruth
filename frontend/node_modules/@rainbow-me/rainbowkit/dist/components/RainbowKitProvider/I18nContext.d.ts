import React, { ReactNode } from 'react';
import { Locale, i18n } from '../../locales';
export declare const I18nContext: React.Context<{
    i18n: typeof i18n;
}>;
interface I18nProviderProps {
    children: ReactNode;
    locale?: Locale;
}
export declare const I18nProvider: ({ children, locale }: I18nProviderProps) => React.JSX.Element;
export {};
