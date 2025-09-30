import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

function UnderFooter() {
  const t = useTranslations('Layout.footer.under');

  const navItems = [
    { name: t('nav.FAQ'), href: '/faqs' },
    { name: t('nav.terms'), href: '/terms' },
    { name: t('nav.privacy'), href: '/policy' }
  ];

  return (
    <div className="bg-primary-identity text-primary-foreground py-2">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
        <p className="mb-2 text-sm md:mb-0">{t('copy')}</p>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="text-sm hover:underline">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UnderFooter;
