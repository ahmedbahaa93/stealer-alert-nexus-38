import { Link } from '@/i18n/routing';
import Image from 'next/image';

interface LogoProps {
  isDark?: boolean;
}

function Logo({ isDark = false }: LogoProps) {
  // Always use the same logo image regardless of page, but handle different background colors
  return (
    <Link href="/" className="flex items-center justify-center transition-transform duration-200 hover:scale-105">
      <Image
        // Use the NavLogo.svg regardless of dark/light background to ensure consistency
        src={isDark ? '/assets/footer-logo.svg' : '/NavLogo.svg'}
        alt="RaiseUp Logo"
        width={120}
        height={50}
        className={`w-24 h-12 sm:h-9 md:h-12 lg:h-14 xl:h-16 ${isDark ? 'brightness-[1.2]' : ''}`}
        priority
      />
    </Link>
  );
}

export default Logo;
