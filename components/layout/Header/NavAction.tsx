"use client";

import { useEffect } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { User, LogOut, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { useClientAuth } from '@/hooks/useClientAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchIcon from './SearchIcon';
import { useSyncProfileData } from '@/hooks/useSyncProfileData';

interface NavActionProps {
  isDark?: boolean;
}

function NavAction({ isDark = false }: NavActionProps) {
  const { logout } = useAuthStore();
  const { isAuthenticated, user } = useClientAuth();
  const t = useTranslations('Layout.nav');
  const router = useRouter();

  // Sync profile data to ensure avatar is up-to-date
  useSyncProfileData();

  // Debug logging to see what's in the user object
  useEffect(() => {
    if (user) {
      console.log('🔍 NavAction user data:', {
        user,
        avatar: user.avatar,
        avatarType: typeof user.avatar,
        avatarUrl: user.avatar
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    // Navigate to home page to ensure navbar updates
    router.push('/');
  };

  const getInitials = () => {
    if (!user?.first_name || !user?.last_name) return 'U';
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 lg:gap-4 xl:gap-6">
      {isAuthenticated ? (
        <>
          {/* Search Icon - Centered for all screen sizes */}
          <div className="flex items-center justify-center">
            <SearchIcon isDark={isDark} />
          </div>

          {/* Beautiful Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full hover:bg-secondary/10 transition-all duration-300">
                <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-secondary/20 hover:border-secondary transition-all duration-300">
                  <AvatarImage
                    src={user?.avatar || ''}
                    alt={user?.first_name || 'User'}
                    className="object-cover"
                    onError={() => console.warn('🖼️ NavAction avatar failed to load:', user?.avatar)}
                    onLoad={() => console.log('✅ NavAction avatar loaded successfully:', user?.avatar)}
                  />
                  <AvatarFallback className="bg-secondary text-primary font-semibold text-sm lg:text-base">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 lg:w-80 bg-white shadow-2xl border border-gray-100 rounded-2xl p-2 animate-in fade-in-0 zoom-in-95"
              align="end"
              sideOffset={5}
            >
              <DropdownMenuLabel className="p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 lg:h-12 lg:w-12 border-2 border-white shadow-md">
                    <AvatarImage
                      src={user?.avatar || ''}
                      alt={user?.first_name || 'User'}
                      onError={() => console.warn('🖼️ NavAction dropdown avatar failed to load:', user?.avatar)}
                      onLoad={() => console.log('✅ NavAction dropdown avatar loaded successfully:', user?.avatar)}
                    />
                    <AvatarFallback className="bg-primary text-white font-semibold text-base lg:text-lg">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                      {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : 'User'
                      }
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-gray-100" />

              <DropdownMenuItem className="p-2 lg:p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer group" asChild>
                <Link href="/profile" className="flex items-center gap-3">
                  <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <User className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-700 text-sm lg:text-base">
                    {t('profile')}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-2 lg:p-3 rounded-xl hover:bg-green-50 transition-colors duration-200 cursor-pointer group" asChild>
                <Link href="/settings" className="flex items-center gap-3">
                  <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Settings className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-green-700 text-sm lg:text-base">
                    Settings
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-100 my-2" />

              <DropdownMenuItem
                className="p-2 lg:p-3 rounded-xl hover:bg-red-50 transition-colors duration-200 cursor-pointer group"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-1.5 lg:p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <LogOut className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-red-700 text-sm lg:text-base">
                    {t('logout')}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
          {/* Search Icon for non-authenticated users */}
          <div className="flex items-center">
            <SearchIcon isDark={isDark} />
          </div>

          {/* Login and Signup buttons - ONLY show on large screens (lg and above) */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className={`${isDark
                  ? 'text-white hover:text-white/90 hover:bg-primary-foreground/10'
                  : 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'} text-sm lg:text-base px-3 lg:px-4 py-2`}
                style={{ color: isDark ? 'white' : '#0f43b4' }}
              >
                {t('login')}
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="default"
                className={`${isDark
                  ? 'bg-white hover:bg-gray-100 text-primary'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'} text-sm lg:text-base px-3 lg:px-4 py-2`}
                style={{
                  backgroundColor: isDark ? 'white' : '#0f43b4',
                  color: isDark ? '#0f43b4' : 'white'
                }}
              >
                {t('signUp')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavAction;
