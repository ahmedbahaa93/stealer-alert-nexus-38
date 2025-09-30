'use client';

import { MotionDiv, MotionButton, MotionP, AnimatePresence } from '@/components/ui/motion';
import { CheckCircle, XCircle, AlertCircle, WifiOff, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ContactFormError } from '@/lib/api/contact';

interface ContactFormNotificationProps {
    isVisible: boolean;
    type: 'success' | 'error' | 'loading';
    error?: ContactFormError | null;
    onClose?: () => void;
}

export default function ContactFormNotification({
    isVisible,
    type,
    error,
    onClose
}: ContactFormNotificationProps) {
    const t = useTranslations('contact-page.form.form.notifications');

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'error':
                if (error?.isNetworkError) {
                    return <WifiOff className="w-6 h-6 text-red-500" />;
                }
                if (error?.isTimeout) {
                    return <Clock className="w-6 h-6 text-yellow-500" />;
                }
                if (error?.isRateLimit) {
                    return <AlertCircle className="w-6 h-6 text-orange-500" />;
                }
                return <XCircle className="w-6 h-6 text-red-500" />;
            case 'loading':
                return (
                    <MotionDiv
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-primary-identity border-t-transparent rounded-full"
                    />
                );
            default:
                return <AlertCircle className="w-6 h-6 text-gray-500" />;
        }
    };

    const getMessage = () => {
        switch (type) {
            case 'success':
                return t('success');
            case 'error':
                if (error?.isNetworkError) {
                    return t('errors.network');
                }
                if (error?.isTimeout) {
                    return t('errors.timeout');
                }
                if (error?.isRateLimit) {
                    return t('errors.rateLimit');
                }
                return error?.message || t('errors.general');
            case 'loading':
                return t('sending');
            default:
                return '';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
            case 'error':
                if (error?.isNetworkError) {
                    return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
                }
                if (error?.isTimeout) {
                    return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
                }
                if (error?.isRateLimit) {
                    return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
                }
                return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
            case 'loading':
                return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop overlay */}
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={type !== 'loading' ? onClose : undefined}
                    />

                    {/* Notification Modal */}
                    <MotionDiv
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{ opacity: 0, y: -50, scale: 0.95 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className={`relative max-w-md w-full mx-4 p-6 rounded-2xl border-2 backdrop-blur-md shadow-2xl
                         ${getBackgroundColor()}`}
                    >
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                            <div className="flex-shrink-0 mt-1">
                                {getIcon()}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {type === 'success' && '🎉 Message Sent Successfully!'}
                                    {type === 'error' && '❌ Message Failed to Send'}
                                    {type === 'loading' && '📤 Sending Message...'}
                                </h3>

                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {getMessage()}
                                </p>

                                {/* Additional error details */}
                                {type === 'error' && error?.code && (
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        {t('errorCode')}: {error.code}
                                    </p>
                                )}

                                {/* Retry suggestion for certain error types */}
                                {type === 'error' && (error?.isNetworkError || error?.isTimeout) && (
                                    <MotionP
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded"
                                    >
                                        {t('retrySuggestion')}
                                    </MotionP>
                                )}

                                {/* Success message enhancement */}
                                {type === 'success' && (
                                    <MotionP
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-3 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 p-3 rounded-lg"
                                    >
                                        Thank you for reaching out! We&apos;ll get back to you within 24 hours.
                                    </MotionP>
                                )}
                            </div>

                            {/* Close button */}
                            {type !== 'loading' && onClose && (
                                <MotionButton
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 
                             dark:hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-gray-600 
                             dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <XCircle className="w-5 h-5" />
                                </MotionButton>
                            )}
                        </div>

                        {/* Progress bar for loading state */}
                        {type === 'loading' && (
                            <MotionDiv
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="mt-4 h-2 bg-primary-identity rounded-full origin-left"
                            />
                        )}

                        {/* Success celebration particles */}
                        {type === 'success' && (
                            <>
                                {[...Array(12)].map((_, i) => (
                                    <MotionDiv
                                        key={i}
                                        initial={{
                                            opacity: 0,
                                            scale: 0,
                                            x: 0,
                                            y: 0
                                        }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, 1.5, 0],
                                            x: (Math.random() - 0.5) * 200,
                                            y: (Math.random() - 0.5) * 200
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.1,
                                            ease: "easeOut"
                                        }}
                                        className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full"
                                    />
                                ))}
                            </>
                        )}

                        {/* Animated border for emphasis */}
                        <MotionDiv
                            animate={{
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl border-2 border-current opacity-20 pointer-events-none"
                        />
                    </MotionDiv>
                </div>
            )}
        </AnimatePresence>
    );
}
