'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import HeadCard from './HeadCard';
import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';

function Header() {
  const t = useTranslations('user-nav');
  const [width, setWidth] = useState(0);
  const [imageError, setImageError] = useState(false);
  const breakpoint = 700;
  // Fetch user profile data
  const { data: profile, isLoading } = useUserProfile();
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      // subscribe to window resize event "onComponentDidMount"
      window.addEventListener('resize', handleResizeWindow);
    }
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  // Reset image error when profile changes
  useEffect(() => {
    setImageError(false);
  }, [profile?.avatar]);

  // Create initials from user's name if no avatar is available
  const getInitials = () => {
    if (!profile?.personal_info?.full_name) return '?';
    const nameParts = profile.personal_info.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <HeadCard>
      <div className="items-center justify-between max-lg:space-y-8 lg:flex">
        <div className="items-center justify-center gap-4 max-lg:text-center lg:flex">
          {isLoading ? (
            <>
              <Skeleton className="mb-2 max-lg:mx-auto h-[100px] w-[100px] lg:h-[200px] lg:w-[200px] rounded-full" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-60" />
              </div>
            </>
          ) : profile?.avatar && !imageError ? (
            <Image
              src={profile.avatar}
              alt="user-photo"
              width={width > breakpoint ? 200 : 100}
              height={width > breakpoint ? 200 : 100}
              className="mb-2 max-lg:mx-auto object-cover rounded-full"
              style={{ width: 'auto', height: 'auto' }}
              onError={() => {
                console.warn('Failed to load profile image:', profile.avatar);
                setImageError(true);
              }}
              onLoad={() => setImageError(false)}
            />
          ) : (
            <div
              className={`mb-2 max-lg:mx-auto flex items-center justify-center text-4xl font-bold bg-primary-identity text-white rounded-full ${width > breakpoint ? 'w-[200px] h-[200px]' : 'w-[100px] h-[100px]'
                }`}
            >
              {getInitials()}
            </div>
          )}
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-60" />
              </>
            ) : (
              <>
                <p className="text-primary-identity mb-2 text-3xl">
                  {profile?.personal_info?.full_name || 'Unknown User'}
                </p>
                <p className="text-2xl wrap-anywhere text-[#808080]">
                  {profile?.personal_info?.email || 'No email available'}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="max-lg: flex max-lg:items-center max-lg:justify-center">
          <Link
            href="/settings"
            className="bg-primary-foreground text-primary-identity border-primary-identity hover:bg-primary-identity hover:text-primary-foreground hover:border-primary-foreground flex gap-2 rounded-lg border-2 p-3 px-10 drop-shadow-lg drop-shadow-[#00000040] duration-300 ease-in-out max-lg:text-center"
          >
            {t('edit')}
          </Link>
        </div>
      </div>
    </HeadCard>
  );
}

export default Header;
