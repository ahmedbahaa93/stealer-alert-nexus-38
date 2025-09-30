'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Home, BookOpen, Users, Phone, HelpCircle, LogIn, UserPlus, User, Settings, LogOut } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { useClientAuth } from '@/hooks/useClientAuth';
import { useSyncProfileData } from '@/hooks/useSyncProfileData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import './enhanced-mobile-menu.css';

interface EnhancedMobileMenuProps {
    isDark?: boolean;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
}

export default function EnhancedMobileMenu({ isDark = false }: EnhancedMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuthStore();
    const { isAuthenticated, user } = useClientAuth();
    const t = useTranslations('Layout.nav');
    const pathname = usePathname();
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const router = useRouter();

    // Sync profile data to ensure avatar is up-to-date
    useSyncProfileData();

    // Debug logging
    useEffect(() => {
        if (user) {
            console.log('🔍 EnhancedMobileMenu user data:', {
                user,
                avatar: user.avatar,
                avatarType: typeof user.avatar,
                avatarUrl: user.avatar
            });
        }
    }, [user]);

    const getInitials = () => {
        if (!user?.first_name || !user?.last_name) return 'U';
        return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isOpen && event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push('/');
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Navigation items for all users
    const mainNavItems: NavItem[] = [
        {
            name: t('home'),
            href: '/',
            icon: Home,
            description: 'Return to home page'
        },
        {
            name: t('aboutUs'),
            href: '/about',
            icon: Users,
            description: 'Learn more about us'
        },
        {
            name: t('courses'),
            href: '/courses',
            icon: BookOpen,
            description: 'Browse our courses'
        },
        {
            name: t('blog'),
            href: '/blog',
            icon: BookOpen,
            description: 'Read our latest articles'
        },
        {
            name: t('contactUs'),
            href: '/contact',
            icon: Phone,
            description: 'Get in touch with us'
        },
        {
            name: t('faqs'),
            href: '/faqs',
            icon: HelpCircle,
            description: 'Frequently asked questions'
        }
    ];

    // Auth items for non-authenticated users
    const authItems: NavItem[] = [
        {
            name: t('login'),
            href: '/login',
            icon: LogIn,
            description: 'Sign in to your account'
        },
        {
            name: t('signUp'),
            href: '/signup',
            icon: UserPlus,
            description: 'Create a new account'
        }
    ];

    // Profile items for authenticated users
    const profileItems: NavItem[] = [
        {
            name: t('profile'),
            href: '/profile',
            icon: User,
            description: 'View and edit your profile'
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Settings,
            description: 'Manage your preferences'
        }
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`
                        menu-trigger-enhanced relative h-11 w-11 rounded-xl transition-all duration-300 hover:scale-105 group
                        ${isDark
                            ? 'hover:bg-white/15 text-white border border-white/20 hover:border-white/40'
                            : 'hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-400'
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95
                        ${isDark ? 'focus:ring-white/20' : 'focus:ring-blue-500/20'}
                        backdrop-blur-sm shadow-lg hover:shadow-xl
                    `}
                    aria-label={isOpen ? t('closeMenu') : t('openMenu')}
                >
                    <Menu className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side={isRTL ? "left" : "right"}
                className="w-[90vw] max-w-md p-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 border-l-0"
            >
                {/* Hidden title for accessibility */}
                <SheetTitle className="sr-only">{t('menu')}</SheetTitle>

                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6 pb-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-white bg-opacity-5 enhanced-mobile-menu-bg-pattern" />
                    </div>

                    {/* Close Button */}
                    <div className={`flex justify-${isRTL ? 'start' : 'end'} mb-4 relative z-10`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="enhanced-close-btn h-10 w-10 text-white/90 hover:text-white hover:bg-white/20 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95 shadow-lg"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* User Section */}
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-3 border-white/30 shadow-lg">
                                    <AvatarImage
                                        src={user?.avatar || ''}
                                        alt={user?.first_name || 'User'}
                                        className="object-cover"
                                        onError={() => console.warn('🖼️ EnhancedMobileMenu avatar failed to load:', user?.avatar)}
                                        onLoad={() => console.log('✅ EnhancedMobileMenu avatar loaded successfully:', user?.avatar)}
                                    />
                                    <AvatarFallback className="bg-white/20 text-white font-bold text-xl backdrop-blur-sm">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-white truncate">
                                        {user?.first_name && user?.last_name
                                            ? `${user.first_name} ${user.last_name}`
                                            : 'Welcome!'
                                        }
                                    </h2>
                                    <p className="text-blue-100 text-sm truncate">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-2">
                            <div className="h-16 w-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Welcome!</h2>
                            <p className="text-blue-100 text-sm">Sign in to access your account</p>
                        </div>
                    )}
                </div>

                {/* Navigation Section */}
                <div className={`flex-1 px-4 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto enhanced-mobile-menu-scroll ${isRTL ? 'rtl' : ''}`}>
                    {/* Main Navigation */}
                    <nav className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                            Navigation
                        </h3>
                        {mainNavItems.map((item, index) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={`
                                        enhanced-menu-item group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                                        ${isActive
                                            ? 'bg-blue-100 text-blue-700 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                        }
                                    `}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className={`
                                        p-2 rounded-lg transition-all duration-300
                                        ${isActive
                                            ? 'bg-blue-200 text-blue-700'
                                            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                        }
                                    `}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.name}</p>
                                        {item.description && (
                                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                        )}
                                    </div>
                                    <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator />

                    {/* Auth Section */}
                    {isAuthenticated ? (
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                Account
                            </h3>
                            {profileItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className={`
                                            group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                                            ${isActive
                                                ? 'bg-green-100 text-green-700 shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            p-2 rounded-lg transition-all duration-300
                                            ${isActive
                                                ? 'bg-green-200 text-green-700'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                                            }
                                        `}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                            )}
                                        </div>
                                        <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                                    </Link>
                                );
                            })}

                            <Separator />

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-gray-700 hover:bg-red-50 hover:text-red-600"
                            >
                                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-300">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="font-medium truncate">{t('logout')}</p>
                                    <p className="text-xs text-gray-500 truncate">Sign out of your account</p>
                                </div>
                                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} text-gray-400`} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                Get Started
                            </h3>
                            {authItems.map((item) => {
                                const Icon = item.icon;
                                const isLogin = item.href === '/login';

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className={`
                                            group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                                            ${isLogin
                                                ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            p-2 rounded-lg transition-all duration-300
                                            ${isLogin
                                                ? 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                                            }
                                        `}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                            )}
                                        </div>
                                        <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} ${isLogin ? 'text-blue-400' : 'text-green-400'}`} />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 pb-6">
                    <div className="text-center text-xs text-gray-500">
                        <p>© 2024 RaiseUp Platform</p>
                        <p className="mt-1">Version 2.0</p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}