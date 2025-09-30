'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEnhancedGoogleAuthSimple } from '@/hooks/useEnhancedGoogleAuthSimple';
import { useCustomToast } from '@/components/ui/CustomToastProvider';

interface SocialAuthButtonsProps {
  disabled?: boolean;
  context?: 'login' | 'signup';
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  disabled = false,
  context = 'login'
}) => {
  const t = useTranslations();
  const { handleGoogleAuth, isLoading: isGoogleLoading } = useEnhancedGoogleAuthSimple();
  const customToast = useCustomToast();

  const handleAppleAuth = () => {
    customToast.warning(
      '🍎 Apple Sign-In Coming Soon',
      'Apple authentication is currently being implemented. Please use Google or email/password for now.',
      5000
    );
  };

  return (
    <div className="flex flex-col items-center gap-[18px] w-full">
      <h2 className="text-[20px] md:text-[22px] lg:text-[24px] font-medium text-[#61e4ae] font-inter leading-[29px] text-center">
        {context === 'login'
          ? t("Login.messages.loginWith")
          : t("SignUp.messages.orSignUpWith")
        }
      </h2>

      <div className="flex items-center gap-5">
        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={disabled || isGoogleLoading}
          className={`
            relative w-[56px] h-[56px] md:w-[64px] md:h-[64px] 
            bg-[#f8f9fa] rounded-[12px] border border-[#e9ecef] 
            flex items-center justify-center cursor-pointer 
            transition-all duration-300 shadow-sm
            ${(disabled || isGoogleLoading)
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#f1f3f4] hover:scale-105 hover:shadow-md active:scale-95'
            }
          `}
          aria-label="Sign in with Google"
        >
          {isGoogleLoading ? (
            <div className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] border-2 border-[#4285f4] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Image
              className="w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
              alt="Google icon"
              src="/assets/signup/Google.svg"
              width={32}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
            />
          )}
        </button>

        {/* Apple Auth Button - Disabled */}
        <button
          onClick={handleAppleAuth}
          disabled={true} // Always disabled as per requirement
          className="
            relative w-[56px] h-[56px] md:w-[64px] md:h-[64px] 
            bg-[#f8f9fa] rounded-[12px] border border-[#e9ecef] 
            flex items-center justify-center cursor-not-allowed 
            transition-all duration-200 shadow-sm
            opacity-30 grayscale
          "
          aria-label="Apple Sign-In (Coming Soon)"
        >
          <Image
            className="w-[28px] h-[28px] md:w-[32px] md:h-[32px]"
            alt="Apple icon"
            src="/assets/signup/Apple.svg"
            width={32}
            height={32}
            style={{ width: 'auto', height: 'auto' }}
          />
          {/* Coming Soon Badge */}
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded text-[8px] font-semibold">
            Soon
          </div>
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        {context === 'login'
          ? 'Quick and secure login with your existing accounts'
          : 'Create your account instantly with social login'
        }
      </p>
    </div>
  );
};
