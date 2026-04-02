import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import en from '../messages/en.json';
import ar from '../messages/ar.json';

const messagesMap: Record<string, any> = { en, ar };

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: messagesMap[locale] || messagesMap.en
  };
});
