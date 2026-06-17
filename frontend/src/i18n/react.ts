import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LanguageManager } from '@/utils';
import zhCN from '../../../internal/web/translation/zh-CN.json';

const FALLBACK = 'zh-CN';

const lazyModules = import.meta.glob([
  '../../../internal/web/translation/*.json',
  '!../../../internal/web/translation/zh-CN.json',
]);

function moduleKeyFor(code: string): string {
  return `../../../internal/web/translation/${code}.json`;
}

let active: string = LanguageManager.getLanguage();
if (active !== FALLBACK && !Object.prototype.hasOwnProperty.call(lazyModules, moduleKeyFor(active))) {
  active = FALLBACK;
}

export async function readyI18n() {
  await i18next.use(initReactI18next).init({
    lng: active,
    fallbackLng: FALLBACK,
    resources: { [FALLBACK]: { translation: zhCN } },
    interpolation: { escapeValue: false, prefix: '{', suffix: '}' },
    returnNull: false,
  });
  if (active !== FALLBACK) {
    const loader = lazyModules[moduleKeyFor(active)] as (() => Promise<{ default: Record<string, unknown> }>) | undefined;
    if (loader) {
      const mod = await loader();
      const messages = (mod.default ?? mod) as Record<string, unknown>;
      i18next.addResourceBundle(active, 'translation', messages, true, true);
      await i18next.changeLanguage(active);
    }
  }
  return i18next;
}

export { i18next as i18n };
