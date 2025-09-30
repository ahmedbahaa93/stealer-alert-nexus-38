import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

function QuickLinks() {
  const t = useTranslations('Layout.footer.quick-link');

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('courses'), href: '/courses' },
    { name: t('aboutUs'), href: '/about' },
    { name: t('contactUs'), href: '/contact' }
  ];

  return (
    <div className="my-auto md:ml-10 flex flex-col gap-y-7">
      <h3 className="text-primary-foreground text-xl">{t('title')}</h3>
      <ul className="flex flex-col gap-y-7">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="text-primary-foreground hover:text-gray-300"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickLinks;
