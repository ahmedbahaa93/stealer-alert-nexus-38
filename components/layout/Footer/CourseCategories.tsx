import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

function CourseCategories() {
  const t = useTranslations('Layout.footer.course-category');

  const navItems = [
    { name: t('development'), href: '/courses?category=development' },
    { name: t('data-science'), href: '/courses?category=data-science' },
    { name: t('AI'), href: '/courses?category=AI' },
    { name: t('cybersecurity'), href: '/courses?category=cybersecurity' },
    { name: t('marketing'), href: '/courses?category=marketing' },
    { name: t('design'), href: '/courses?category=design' }
  ];

  return (
    <div className="my-auto flex flex-col gap-y-3">
      <h3 className="text-primary-foreground text-xl">{t('title')}</h3>
      <ul className="flex flex-col gap-y-3">
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

export default CourseCategories;
