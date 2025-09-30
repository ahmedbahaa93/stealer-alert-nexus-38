"use client";

import { useEffect } from 'react';
import { User, LogIn, UserPlus, LogOut, Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useSyncProfileData } from '@/hooks/useSyncProfileData';
import SearchIcon from './SearchIcon';

interface NavActionMobileProps {
  isDark?: boolean;
}

function NavActionMobile({ isDark = false }: NavActionMobileProps) {
  const t = useTranslations('Layout.nav');
  const { logout } = useAuthStore();
  const { isAuthenticated, user } = useClientAuth();
  const router = useRouter();

  // Sync profile data to ensure avatar is up-to-date
  useSyncProfileData();

  // Debug logging to see what's in the user object
  useEffect(() => {
    if (user) {
      console.log('🔍 NavActionMobile user data:', {
        user,
        avatar: user.avatar,
        avatarType: typeof user.avatar,
        avatarUrl: user.avatar
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = () => {
    if (!user?.first_name || !user?.last_name) return 'U';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  if (isAuthenticated) {
    return (
      <div className="flex gap-2 sm:gap-3 items-center">
        {/* Search Icon - Centered */}
        <div className="flex items-center justify-center">
          <SearchIcon isDark={isDark} />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className="relative rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white/20 hover:border-white/40 transition-all duration-300">
                <AvatarImage
                  src={user?.avatar || ''}
                  alt={user?.first_name || 'User'}
                  className="object-cover"
                  onError={() => console.warn('🖼️ NavActionMobile avatar failed to load:', user?.avatar)}
                  onLoad={() => console.log('✅ NavActionMobile avatar loaded successfully:', user?.avatar)}
                />
                <AvatarFallback className="bg-white/10 text-white font-semibold text-sm backdrop-blur-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-72 bg-white shadow-2xl border border-gray-100 rounded-2xl p-2 animate-in fade-in-0 zoom-in-95">
            {/* User Info Header */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                  <AvatarImage
                    src={user?.avatar || ''}
                    alt={user?.first_name || 'User'}
                    onError={() => console.warn('🖼️ NavActionMobile dropdown avatar failed to load:', user?.avatar)}
                    onLoad={() => console.log('✅ NavActionMobile dropdown avatar loaded successfully:', user?.avatar)}
                  />
                  <AvatarFallback className="bg-primary text-white font-semibold text-base">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : 'User'
                    }
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              <Link href="/profile" className="flex gap-3 items-center p-3 rounded-xl hover:bg-blue-50 transition-colors text-sm group">
                <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-700">{t('profile')}</span>
              </Link>

              <Link href="/settings" className="flex gap-3 items-center p-3 rounded-xl hover:bg-green-50 transition-colors text-sm group">
                <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Settings className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-green-700">Settings</span>
              </Link>

              <div className="border-t border-gray-100 my-2" />

              <button
                onClick={handleLogout}
                className="w-full flex gap-3 items-center p-3 rounded-xl hover:bg-red-50 transition-colors text-sm group"
              >
                <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-red-700">{t('logout')}</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // For non-authenticated users - only show search icon on mobile/tablet, hide login/signup buttons
  return (
    <div className="flex gap-2 sm:gap-3 items-center">
      {/* Search Icon for non-authenticated users */}
      <div className="flex items-center justify-center">
        <SearchIcon isDark={isDark} />
      </div>

      {/* Only show user icon for authentication on mobile/tablet when not authenticated */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Authentication menu"
          >
            <User className={`${isDark ? 'text-white' : 'text-primary-identity'} w-5 h-5 sm:w-6 sm:h-6`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-white shadow-xl rounded-xl border-0 p-2">
          <div className="space-y-1">
            <Link href="/login" className="flex gap-3 items-center p-3 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              <LogIn size={16} className="text-blue-600" />
              <span className="font-medium text-blue-600">{t('login')}</span>
            </Link>
            <Link href="/signup" className="flex gap-3 items-center p-3 rounded-lg hover:bg-green-50 transition-colors text-sm">
              <UserPlus size={16} className="text-green-600" />
              <span className="font-medium text-green-600">{t('signUp')}</span>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default NavActionMobile;
