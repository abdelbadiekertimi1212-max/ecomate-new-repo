'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-c)',
        borderRadius: '8px',
        padding: '6px 12px',
        color: 'var(--text-sub)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      className="hover:text-white"
    >
      <span style={{ fontSize: '15px' }}>🌐</span>
      <span>{locale === 'ar' ? 'EN' : 'AR'}</span>
    </button>
  );
}
