"use client";

import React, { useState, useEffect } from "react";
import { MotionDiv } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomToast } from "@/components/ui/CustomToastProvider";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/useLocalization";
import "./OTPVerification.css";

interface OTPVerificationProps {
    email: string;
    // eslint-disable-next-line no-unused-vars
    onVerify: (code: string) => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    title: string;
    description: string;
    resendAction?: () => Promise<void>;
}

export const OTPVerification = ({
    email,
    onVerify,
    onBack,
    isLoading,
    title,
    description,
    resendAction
}: OTPVerificationProps) => {
    const t = useTranslations('OTP');
    const { isRtl } = useDirection();
    const customToast = useCustomToast();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [countdown, setCountdown] = useState(60);
    const [progressWidth, setProgressWidth] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Auto-focus on the first input when component mounts
    useEffect(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) {
            firstInput.focus();
        }
    }, []);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            // Update countdown
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

            // Calculate and update progress width
            const progress = ((60 - countdown) / 60) * 100;
            setProgressWidth(progress);

            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpCode = otp.join("");
        if (otpCode.length !== 4) {
            customToast.error('🔢 Incomplete Code', 'Please enter all 4 digits of your verification code.', 4000);

            // Focus on the first empty input
            const firstEmptyIndex = otp.findIndex(digit => !digit);
            if (firstEmptyIndex !== -1) {
                const input = document.getElementById(`otp-${firstEmptyIndex}`);
                input?.focus();
            }
            return;
        }

        // Check for invalid characters (should only be numbers)
        if (!/^\d{4}$/.test(otpCode)) {
            customToast.error('🔢 Invalid Code Format', 'Verification code should only contain numbers.', 4000);

            // Clear all inputs and focus on first one
            setOtp(["", "", "", ""]);
            setTimeout(() => {
                const firstInput = document.getElementById('otp-0');
                firstInput?.focus();
            }, 100);
            return;
        }

        try {
            await onVerify(otpCode);
        } catch (error) {
            console.error("❌ OTP verification failed:", error);
            // Error handling is done in the parent component

            // Clear the OTP inputs on error
            setOtp(["", "", "", ""]);
            setTimeout(() => {
                const firstInput = document.getElementById('otp-0');
                firstInput?.focus();
            }, 100);
        }
    };

    const handleResend = async () => {
        if (!canResend || !resendAction) return;

        setIsResending(true);
        try {
            await resendAction();
            setCountdown(60);
            setProgressWidth(0); // Reset progress width
            setCanResend(false);
            setOtp(["", "", "", ""]);

            // Auto-focus on the first input after resending
            setTimeout(() => {
                const firstInput = document.getElementById('otp-0');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);

            // Success message is handled in the parent component
        } catch (error) {
            console.error('❌ Resend OTP Error:', error);
            // Error handling is done in the parent component

            // Show a generic error if parent doesn't handle it
            customToast.error('❌ Failed to Resend', 'Unable to send a new verification code. Please try again in a moment.', 6000);
        } finally {
            setIsResending(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow numbers
        const cleanValue = value.replace(/\D/g, '');

        if (cleanValue.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = cleanValue;
            setOtp(newOtp);

            // Auto-focus next input
            if (cleanValue && index < 3) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }

            // If user enters multiple digits at once (paste), distribute them
            if (cleanValue.length === 1 && value.length > 1) {
                const remainingChars = value.slice(1).replace(/\D/g, '');
                if (remainingChars.length > 0 && index < 3) {
                    const nextIndex = index + 1;
                    handleOtpChange(nextIndex, remainingChars);
                }
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === "Backspace") {
            if (otp[index]) {
                // If there's a value, clear it first
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                // If no value and not the first box, go to previous box
                const prevInput = document.getElementById(`otp-${index - 1}`);
                prevInput?.focus();
            }
        }
        // Handle left arrow key
        else if (e.key === "ArrowLeft" && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
        // Handle right arrow key
        else if (e.key === "ArrowRight" && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, '').slice(0, 4);

        if (pastedData.length > 0) {
            // Create a new OTP array, filling from the start
            const newOtp = [...otp];

            for (let i = 0; i < 4; i++) {
                // Fill with pasted data or empty string if pasted data is shorter
                newOtp[i] = i < pastedData.length ? pastedData[i] : "";
            }

            setOtp(newOtp);

            // Focus on the next empty field or the last field if all filled
            const focusIndex = Math.min(pastedData.length, 3);
            setTimeout(() => {
                const targetInput = document.getElementById(`otp-${focusIndex}`);
                targetInput?.focus();
            }, 0);
        }
    };

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-[600px] mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* Header */}
            <div className="text-center space-y-6">
                <MotionDiv
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-[#0f43b4] to-[#61e4ae] rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                </MotionDiv>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-[#0f43b4]">
                        {title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed px-4">
                        {description}
                    </p>
                    <p className="text-sm text-[#61e4ae] font-semibold" dir="ltr">
                        {email}
                    </p>
                </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-[#0f43b4] text-center">
                        {t('labels.enterCode')}
                    </label>
                    <div className="flex justify-center gap-4">
                        {otp.map((digit, index) => (
                            <div key={index} className="relative">
                                <Input
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={digit}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className={`otp-input ${digit ? 'otp-input-filled' : ''}`}
                                    maxLength={1}
                                    disabled={isLoading}
                                    autoComplete="off"
                                    dir="ltr"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                        {t('messages.sentTo')} <span dir="ltr">{email}</span>
                    </p>
                </div>

                {/* Verify Button */}
                <Button
                    type="submit"
                    disabled={isLoading || otp.some(digit => !digit)}
                    className="w-full h-14 bg-gradient-to-r from-[#0f43b4] to-[#1a5bc4] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className={`w-5 h-5 animate-spin ${isRtl ? 'ml-3' : 'mr-3'}`} />
                            {t('buttons.verifying')}
                        </>
                    ) : (
                        t('buttons.verify')
                    )}
                </Button>
            </form>

            {/* Resend Section */}
            <div className="text-center space-y-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                    {t('messages.didntReceive')}
                </p>

                {canResend ? (
                    <Button
                        onClick={handleResend}
                        variant="outline"
                        className="text-[#61e4ae] border-[#61e4ae] hover:bg-[#61e4ae] hover:text-white transition-all duration-300 rounded-lg h-12 px-6 font-semibold"
                        disabled={!resendAction || isResending}
                    >
                        {isResending ? (
                            isRtl ? (
                                <>
                                    {t('buttons.sending')}
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t('buttons.sending')}
                                </>
                            )
                        ) : (
                            isRtl ? (
                                <>
                                    {t('buttons.resend')}
                                    <RefreshCw className="w-4 h-4 ml-2" />
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {t('buttons.resend')}
                                </>
                            )
                        )}
                    </Button>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 font-medium">
                            {t('messages.resendIn')} {countdown}s
                        </p>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                ref={(el) => {
                                    if (el) {
                                        el.style.width = `${progressWidth}%`;
                                    }
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Back Button */}
            <Button
                onClick={onBack}
                variant="ghost"
                className="w-full text-[#0f43b4] hover:bg-[#f3f8fb] h-12 rounded-xl font-semibold transition-all duration-300"
                disabled={isLoading}
            >
                {isRtl ? (
                    <>
                        {t('buttons.back')}
                        <ArrowLeft className="w-5 h-5 ml-2" />
                    </>
                ) : (
                    <>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {t('buttons.back')}
                    </>
                )}
            </Button>
        </MotionDiv>
    );
};
