'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { AlignLeft, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import './stunning-mobile-menu.css';

interface MobileNavProps {
    isDark?: boolean;
}

/**
 * Stunning Mobile Navigation Component
 * 
 * A beautiful, high-performance mobile menu with stunning animations
 * and perfect UX that maintains the original color theme.
 */
function MobileNavStunning({ isDark = false }: MobileNavProps) {
    // State
    const [isOpen, setIsOpen] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    // Refs for animation elements
    const backdropRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Hooks
    const t = useTranslations('Layout.nav');
    const path = usePathname();
    const { isAuthenticated } = useAuthStore();

    // Handle menu opening with perfect animation sequence
    const openMenu = () => {
        setIsOpen(true);
        document.body.classList.add('menu-open');

        // Force any existing stacking contexts to update
        document.documentElement.style.setProperty('--force-stacking-update', '1');

        // Add visible class after a small delay for smooth animation
        setTimeout(() => {
            if (backdropRef.current && menuRef.current) {
                backdropRef.current.classList.add('visible');
                menuRef.current.classList.add('visible');

                // Explicitly set styles to ensure visibility
                backdropRef.current.style.zIndex = '9999990';
                menuRef.current.style.zIndex = '9999999';
            }
            setMenuVisible(true);
        }, 10);
    };

    // Handle menu closing with perfect animation sequence
    const closeMenu = () => {
        if (backdropRef.current && menuRef.current) {
            backdropRef.current.classList.remove('visible');
            menuRef.current.classList.remove('visible');
            setMenuVisible(false);

            // Remove body class immediately to restore normal z-index behavior
            document.body.classList.remove('menu-open');

            // Remove from DOM after animation completes
            setTimeout(() => {
                setIsOpen(false);
            }, 500); // Match CSS transition duration
        }
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (menuVisible) {
            // Store original styles and scroll position
            const originalStyles = {
                overflow: document.body.style.overflow,
                position: document.body.style.position,
                top: document.body.style.top,
                width: document.body.style.width
            };
            const scrollY = window.scrollY;

            // Apply scroll lock styles
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.setAttribute('data-scroll-y', String(scrollY));

            // Clean up function
            return () => {
                // Restore original styles
                document.body.style.overflow = originalStyles.overflow;
                document.body.style.position = originalStyles.position;
                document.body.style.top = originalStyles.top;
                document.body.style.width = originalStyles.width;

                // Restore scroll position
                const savedScrollY = document.body.getAttribute('data-scroll-y');
                if (savedScrollY) {
                    window.scrollTo(0, parseInt(savedScrollY));
                    document.body.removeAttribute('data-scroll-y');
                }
            };
        }
    }, [menuVisible]);

    // Navigation items based on authentication status
    const guestNavItems = [
        { name: t('home'), href: '/' },
        { name: t('aboutUs'), href: '/about' },
        { name: t('courses'), href: '/courses' },
        { name: t('blog'), href: '/blog' },
        { name: t('contactUs'), href: '/contact' },
        { name: t('faqs'), href: '/faqs' },
        { name: t('login'), href: '/login' },
        { name: t('signUp'), href: '/signup' }
    ];

    const authNavItems = [
        { name: t('home'), href: '/' },
        { name: t('aboutUs'), href: '/about' },
        { name: t('courses'), href: '/courses' },
        { name: t('blog'), href: '/blog' },
        { name: t('contactUs'), href: '/contact' },
        { name: t('faqs'), href: '/faqs' }
    ];

    const navItems = isAuthenticated ? authNavItems : guestNavItems;

    return (
        <>
            {/* Menu Toggle Button */}
            <button
                onClick={openMenu}
                className="menu-toggle"
                aria-label="Open navigation menu"
            >
                <AlignLeft
                    className={`${isDark ? 'text-white' : 'text-primary-identity'} h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8`}
                    style={{ color: isDark ? 'white' : '#0f43b4' }}
                />
            </button>

            {/* Render menu when open or during animation */}
            {(isOpen || menuVisible) && (
                <div className="mobile-menu-portal">
                    {/* Backdrop */}
                    <div
                        ref={backdropRef}
                        className="stunning-backdrop"
                        onClick={closeMenu}
                        aria-hidden="true"
                    />

                    {/* Menu Container */}
                    <div
                        ref={menuRef}
                        className="stunning-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                    >
                        {/* Header */}
                        <div className="menu-header">
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                Menu
                            </h2>
                            <button
                                onClick={closeMenu}
                                className="menu-close"
                                aria-label="Close navigation menu"
                            >
                                <X className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="menu-content">
                            <nav aria-label="Main navigation">
                                <ul className="menu-nav">
                                    {navItems.map((item, index) => (
                                        <li
                                            key={item.name}
                                            className={`menu-item menu-item-${index}`}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`menu-link ${path === item.href || (item.href !== '/' && path.startsWith(item.href)) ? 'active' : ''}`}
                                                onClick={closeMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MobileNavStunning;
