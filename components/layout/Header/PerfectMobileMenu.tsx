'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import './perfect-mobile-menu.css';

interface PerfectMobileMenuProps {
    isDark?: boolean;
}

/**
 * PerfectMobileMenu - Completely rebuilt mobile menu with perfect RTL support
 * Features: Hardware-accelerated animations, proper z-index management, RTL positioning
 */
export default function PerfectMobileMenu({ isDark = false }: PerfectMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const t = useTranslations('Layout.nav');
    const path = usePathname();
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Refs for focus management
    const menuRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);
    const lastFocusableRef = useRef<HTMLAnchorElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    // Navigation items
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

    // Open menu with smooth animations
    const openMenu = () => {
        setIsAnimating(true);
        setIsOpen(true);

        // Preserve scroll position
        const scrollY = window.scrollY;
        document.documentElement.style.setProperty('--scroll-position', `${scrollY}px`);

        // Apply body scroll lock
        requestAnimationFrame(() => {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.touchAction = 'none';
            document.body.classList.add('menu-opening');

            // Animate menu items in
            setTimeout(() => {
                document.querySelectorAll('.ultra-menu-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 60);
                });
                setIsAnimating(false);
            }, 150);
        });
    };

    // Close menu with animations
    const closeMenu = () => {
        setIsAnimating(true);

        // Animate items out
        document.querySelectorAll('.ultra-menu-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('animate-in');
            }, index * 25);
        });

        // Close menu and restore body
        setTimeout(() => {
            setIsOpen(false);
            document.body.classList.remove('menu-opening');

            const scrollY = parseInt(
                document.documentElement.style.getPropertyValue('--scroll-position') || '0'
            );

            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.touchAction = '';

            window.scrollTo({ top: scrollY, behavior: 'instant' });
            setIsAnimating(false);
        }, 250);
    };

    // Focus management
    useEffect(() => {
        if (isOpen && firstFocusableRef.current) {
            setTimeout(() => {
                firstFocusableRef.current?.focus();
            }, 300);
        } else if (!isOpen && toggleButtonRef.current) {
            toggleButtonRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                closeMenu();
                return;
            }

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusableRef.current) {
                    e.preventDefault();
                    lastFocusableRef.current?.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusableRef.current) {
                    e.preventDefault();
                    firstFocusableRef.current?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [isOpen]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <>
            {/* Toggle button */}
            <button
                ref={toggleButtonRef}
                type="button"
                onClick={openMenu}
                aria-label={t('openMenu')}
                aria-expanded={isOpen}
                className={`ultra-menu-toggle ${isDark ? 'dark' : 'light'}`}
            >
                <Menu size={24} />
            </button>

            {/* Mobile menu portal */}
            {typeof window !== 'undefined' && (isOpen || isAnimating) && createPortal(
                <div
                    className={`ultra-menu-overlay ${isOpen ? 'open' : ''}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('siteNavigation')}
                    data-rtl={isRTL}
                >
                    {/* Backdrop */}
                    <div
                        className="ultra-menu-backdrop"
                        onClick={closeMenu}
                        aria-hidden="true"
                    />

                    {/* Sliding menu panel */}
                    <div
                        ref={menuRef}
                        className={`ultra-menu-panel ${isRTL ? 'rtl' : 'ltr'}`}
                    >
                        {/* Header */}
                        <div className="ultra-menu-header">
                            <h2 className="ultra-menu-title">{t('menu')}</h2>
                            <button
                                ref={firstFocusableRef}
                                type="button"
                                className="ultra-menu-close"
                                onClick={closeMenu}
                                aria-label={t('closeMenu')}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className={`ultra-menu-nav ${isRTL ? 'rtl' : 'ltr'}`}>
                            <ul>
                                {navItems.map((item, index) => (
                                    <li
                                        key={item.href}
                                        className={`ultra-menu-item delay-${index}`}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`ultra-menu-link ${path === item.href ||
                                                (item.href !== '/' && path.startsWith(item.href))
                                                ? 'active' : ''
                                                } ${isRTL ? 'rtl' : 'ltr'}`}
                                            onClick={closeMenu}
                                            ref={index === navItems.length - 1 ? lastFocusableRef : null}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
