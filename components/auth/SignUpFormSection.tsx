"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useCustomToast } from "@/components/ui/CustomToastProvider";
import Border from "@/components/auth/Border";
import { OTPVerification } from "@/components/auth/OTPVerification";
import { authAPI, SignupRequest } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

// Form validation schema
const createSignUpSchema = (t: any) =>
    z
        .object({
            firstNameEnglish: z
                .string()
                .min(1, t("SignUp.validation.firstNameRequired"))
                .regex(/^[a-zA-Z\s]+$/, t("SignUp.validation.englishNameRequired")),
            lastNameEnglish: z
                .string()
                .min(1, t("SignUp.validation.lastNameRequired"))
                .regex(/^[a-zA-Z\s]+$/, t("SignUp.validation.englishNameRequired")),
            email: z
                .string()
                .min(1, t("SignUp.validation.emailRequired"))
                .email(t("SignUp.validation.emailInvalid")),
            phone: z
                .string()
                .min(1, t("SignUp.validation.phoneRequired"))
                .regex(/^[0-9]{8,15}$/, t("SignUp.validation.phoneInvalid"))
                .refine((phone) => {
                    // Additional validation for specific countries
                    const cleanPhone = phone.replace(/\D/g, '');
                    return cleanPhone.length >= 8 && cleanPhone.length <= 15;
                }, t("SignUp.validation.phoneInvalid")),
            dateOfBirth: z.string().min(1, t("SignUp.validation.dateOfBirthRequired")),
            gender: z.enum(["male", "female"], { required_error: t("SignUp.validation.genderRequired") }),
            password: z
                .string()
                .min(6, t("SignUp.validation.passwordMinLength"))
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&*])/, t("SignUp.validation.passwordComplexity")),
            confirmPassword: z
                .string()
                .min(1, t("SignUp.validation.confirmPasswordRequired")),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("SignUp.validation.passwordsMatch"),
            path: ["confirmPassword"],
        });

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

export const SignUpFormSection = () => {
    /*~~~~~~~~$ Translation and State Management $~~~~~~~~*/
    const t = useTranslations();
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const customToast = useCustomToast();

    /*~~~~~~~~$ Component State $~~~~~~~~*/
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [selectedPhoneCountry, setSelectedPhoneCountry] = useState("eg");

    /*~~~~~~~~$ Sticky Image Functionality - Only for Large Screens $~~~~~~~~*/
    const imageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleStickyImage = () => {
            if (!imageRef.current || !containerRef.current) return;

            // Only apply sticky behavior on large screens (lg breakpoint and above)
            const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint

            if (!isLargeScreen) {
                // Reset to normal positioning on smaller screens
                const image = imageRef.current;
                image.style.position = 'static';
                image.style.top = 'auto';
                image.style.width = 'auto';
                image.style.zIndex = 'auto';
                return;
            }

            const container = containerRef.current;
            const image = imageRef.current;
            const containerRect = container.getBoundingClientRect();
            const imageHeight = image.offsetHeight;

            // Calculate if we need sticky behavior
            if (containerRect.top <= 0 && containerRect.bottom > imageHeight) {
                // Container is being scrolled, make image sticky
                image.style.position = 'fixed';
                image.style.top = '2rem';
                image.style.width = `${container.offsetWidth / 2}px`; // Half width for right side
                image.style.zIndex = '10';
            } else if (containerRect.top > 0) {
                // Container is above viewport, reset to normal position
                image.style.position = 'static';
                image.style.top = 'auto';
                image.style.width = 'auto';
                image.style.zIndex = 'auto';
            } else if (containerRect.bottom <= imageHeight) {
                // Container is below viewport, position at bottom
                image.style.position = 'absolute';
                image.style.top = `${container.offsetHeight - imageHeight}px`;
                image.style.width = `${container.offsetWidth / 2}px`;
                image.style.zIndex = '10';
            }
        };

        const handleScroll = () => {
            requestAnimationFrame(handleStickyImage);
        };

        const handleResize = () => {
            // Reset positioning on resize
            if (imageRef.current) {
                const image = imageRef.current;
                image.style.position = 'static';
                image.style.top = 'auto';
                image.style.width = 'auto';
                image.style.zIndex = 'auto';
            }
            handleStickyImage();
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Initial call
        handleStickyImage();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    /*~~~~~~~~$ Helper Functions $~~~~~~~~*/

    const getCountryNames = (countryCode: string) => {
        const countryMap: { [key: string]: { en: string; ar: string } } = {
            'eg': { en: 'Egypt', ar: 'مصر' },
            'ksa': { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
            'uae': { en: 'UAE', ar: 'الإمارات العربية المتحدة' },
        };
        return countryMap[countryCode] || { en: 'Egypt', ar: 'مصر' };
    };

    const getCountryPhoneCode = (countryCode: string) => {
        const phoneCodeMap: { [key: string]: string } = {
            'eg': '+20',
            'ksa': '+966',
            'uae': '+971',
        };
        return phoneCodeMap[countryCode] || '+20';
    };

    const detectCountryFromPhone = (phone: string) => {
        // Remove any non-digits and plus sign
        const cleanPhone = phone.replace(/\D/g, '');

        // Check for country codes
        if (cleanPhone.startsWith('20')) {
            return 'eg'; // Egypt
        } else if (cleanPhone.startsWith('966')) {
            return 'ksa'; // Saudi Arabia
        } else if (cleanPhone.startsWith('971')) {
            return 'uae'; // UAE
        }

        // Default to Egypt if no match
        return 'eg';
    };

    const formatPhoneNumber = (phone: string, countryCode?: string) => {
        // Remove any non-digits
        const cleanPhone = phone.replace(/\D/g, '');

        // Detect country from phone if not provided
        const detectedCountry = countryCode || detectCountryFromPhone(cleanPhone);
        const countryPhoneCode = getCountryPhoneCode(detectedCountry);

        // If phone already starts with country code, return as is
        if (cleanPhone.startsWith(countryPhoneCode.replace('+', ''))) {
            return '+' + cleanPhone;
        }

        // Otherwise, add the country code
        return countryPhoneCode + cleanPhone;
    };

    /*~~~~~~~~$ Alternative Google OAuth with Direct API Call $~~~~~~~~*/

    /*~~~~~~~~$ Password Strength Calculation $~~~~~~~~*/
    const calculatePasswordStrength = (password: string) => {
        if (!password) return { score: 0, label: '', colorClass: '', widthClass: 'w-0', requirements: [] };

        let score = 0;
        const requirements = [
            { met: password.length >= 8, text: 'At least 8 characters' },
            { met: /[a-z]/.test(password), text: 'Lowercase letter' },
            { met: /[A-Z]/.test(password), text: 'Uppercase letter' },
            { met: /\d/.test(password), text: 'Number' },
            { met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), text: 'Special character' },
            { met: password.length >= 12, text: '12+ characters (recommended)' }
        ];

        // Calculate score based on requirements met
        const metRequirements = requirements.filter(req => req.met).length;
        score = Math.min((metRequirements / requirements.length) * 100, 100);

        // Determine strength level
        let label = '';
        let colorClass = '';
        let widthClass = '';

        if (score === 0) {
            label = '';
            colorClass = '';
            widthClass = 'w-0';
        } else if (score < 40) {
            label = 'Weak';
            colorClass = 'bg-[#cb0a0a]';
            widthClass = 'w-1/4';
        } else if (score < 60) {
            label = 'Fair';
            colorClass = 'bg-[#f3c50b]';
            widthClass = 'w-1/2';
        } else if (score < 80) {
            label = 'Good';
            colorClass = 'bg-[#047537]';
            widthClass = 'w-3/4';
        } else {
            label = 'Strong';
            colorClass = 'bg-[#047537]';
            widthClass = 'w-full';
        }

        return { score, label, colorClass, widthClass, requirements };
    };

    /*~~~~~~~~$ Form Configuration with Validation $~~~~~~~~*/

    const form = useForm<SignUpFormData>({
        resolver: zodResolver(createSignUpSchema(t)),
        defaultValues: {
            firstNameEnglish: "",
            lastNameEnglish: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "female",
            password: "",
            confirmPassword: "",
        },
    });

    // Function to scroll to the first invalid field
    const scrollToFirstError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        const firstErrorElement = document.getElementById(firstErrorKey);

        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            firstErrorElement.focus();
        }
    };

    const handleSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        try {
            // Use the selected country from phone input
            const phoneCountry = selectedPhoneCountry;

            // Format phone number with selected country code
            const formattedPhone = formatPhoneNumber(data.phone, phoneCountry);

            // Transform form data to API format
            const signupData: SignupRequest = {
                first_name: data.firstNameEnglish,
                last_name: data.lastNameEnglish,
                email: data.email,
                phone_number: formattedPhone,
                gender: data.gender === "male" ? "Male" : "Female",
                date_of_birth: data.dateOfBirth,
                password: data.password,
                country: getCountryNames(phoneCountry)
            };

            const response = await authAPI.signup(signupData);

            // Handle successful response variations
            if (response.status === "success" || response.code === 200 || response.code === 201) {
                setUserEmail(data.email);
                setShowOTP(true);

                customToast.success("Account Created Successfully", `Verification code sent to ${data.email}`, 5000);
            }
            // Handle pending status or verification required
            else if (response.status === "pending" || response.message?.toLowerCase().includes('verification')) {
                setUserEmail(data.email);
                setShowOTP(true);

                customToast.success("Verification Required", response.message || `Please verify your email ${data.email}`, 5000);
            }
            // Handle partial success
            else if (response.status === "partial_success") {
                setUserEmail(data.email);
                setShowOTP(true);

                customToast.success("Almost There", response.message || "Account created, verification required", 6000);
            }
            // Handle other server responses
            else {
                console.warn('⚠️ Unexpected server response:', response);

                customToast.error("Unexpected Response", response.message || "Please check your email or try logging in", 6000);
            }
        } catch (error: any) {
            console.error('❌ Signup Error Details:', {
                error,
                message: error?.message,
                response: error?.response,
                data: error?.data
            });

            // Enhanced server error response parsing
            let serverMessage = '';
            let serverCode = null;
            let errorType = 'unknown';

            // Extract from different error response formats
            if (error?.response?.data) {
                serverMessage = error.response.data.message || error.response.data.error || error.response.data.detail || '';
                serverCode = error.response.data.code || error.response.status;
                errorType = error.response.data.type || 'api_error';
            } else if (error?.data) {
                serverMessage = error.data.message || error.data.error || '';
                serverCode = error.data.code;
                errorType = error.data.type || 'data_error';
            } else if (error?.message) {
                serverMessage = error.message;
                errorType = 'network_error';
            }

            console.log('📊 Parsed server error:', { serverMessage, serverCode, errorType });

            // Handle specific server error codes with enhanced messaging
            if (serverCode === 400) {
                if (serverMessage?.toLowerCase().includes('email') &&
                    (serverMessage?.toLowerCase().includes('already') ||
                        serverMessage?.toLowerCase().includes('exists') ||
                        serverMessage?.toLowerCase().includes('taken') ||
                        serverMessage?.toLowerCase().includes('registered'))) {

                    customToast.error("Email Already Registered", "Please use a different email or try logging in", 6000);

                } else if (serverMessage?.toLowerCase().includes('phone') &&
                    (serverMessage?.toLowerCase().includes('already') ||
                        serverMessage?.toLowerCase().includes('exists') ||
                        serverMessage?.toLowerCase().includes('taken') ||
                        serverMessage?.toLowerCase().includes('registered'))) {

                    customToast.error("Phone Already Registered", "Please use a different number or try logging in", 6000);

                } else if (serverMessage?.toLowerCase().includes('validation') ||
                    serverMessage?.toLowerCase().includes('invalid') ||
                    serverMessage?.toLowerCase().includes('required') ||
                    serverMessage?.toLowerCase().includes('format')) {

                    customToast.error("Invalid Information", serverMessage || "Please check all fields are filled correctly", 5000);

                } else if (serverMessage?.toLowerCase().includes('password')) {
                    customToast.error("Password Issue", serverMessage || "Password doesn't meet requirements", 5000);

                } else {
                    customToast.error("Registration Failed", serverMessage || "Please check your information and try again", 5000);
                }

            } else if (serverCode === 409) {
                customToast.error("Account Already Exists", serverMessage || "Please try logging in instead", 6000);

            } else if (serverCode === 422) {
                customToast.error("Validation Error", serverMessage || "Please check all fields and try again", 5000);

            } else if (serverCode === 429) {
                customToast.error("Too Many Attempts", serverMessage || "Please wait a few minutes before trying again", 8000);

            } else if (serverCode >= 500) {
                customToast.error("Server Issue", serverMessage || "Please try again in a few moments", 6000);

            } else if (error?.code === 'NETWORK_ERROR' ||
                error?.name === 'NetworkError' ||
                serverMessage?.toLowerCase().includes('network') ||
                serverMessage?.toLowerCase().includes('connection') ||
                error?.message?.toLowerCase().includes('fetch')) {

                customToast.error("Connection Problem", "Please check your internet connection", 5000);

            } else if (error?.code === 'TIMEOUT_ERROR' || error?.message?.toLowerCase().includes('timeout')) {
                customToast.error("Request Timeout", "The request took too long, please try again", 5000);

            } else {
                customToast.error("Registration Failed", serverMessage || "Please try again", 6000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPVerification = async (otp: string) => {
        try {
            console.log('🔐 Sending OTP verification:', { email: userEmail, otp: '****' });
            const response = await authAPI.verifyEmail({
                email: userEmail,
                otp
            });
            console.log('✅ OTP verification response:', response);

            // Handle successful verification with enhanced messaging
            if (response.status === "success" && response.data?.user && response.access_token) {
                login(response.data.user, response.access_token);

                customToast.success("Welcome to RaiseUp!", `Welcome ${response.data.user.first_name}! You're now logged in`, 5000);
                router.push("/"); // Redirect to home page
            }
            // Handle successful verification without complete data
            else if (response.status === "success") {
                customToast.success("Email Verified", response.message || "Please try logging in now", 5000);
            }
            // Handle partial verification
            else if (response.status === "partial_success") {
                customToast.success("Verification Processed", response.message || "Please try logging in", 6000);
            }
            // Handle other server responses
            else {
                console.warn('⚠️ Unexpected OTP verification response:', response);

                customToast.error("Verification Issue", response.message || "Please try again or request a new code", 5000);
            }
        } catch (error: any) {
            console.error('❌ OTP Verification Error Details:', {
                error,
                message: error?.message,
                response: error?.response,
                data: error?.data
            });

            // Enhanced server error response parsing for OTP
            let serverMessage = '';
            let serverCode = null;
            let errorType = 'unknown';

            // Extract from different error response formats
            if (error?.response?.data) {
                serverMessage = error.response.data.message || error.response.data.error || error.response.data.detail || '';
                serverCode = error.response.data.code || error.response.status;
                errorType = error.response.data.type || 'otp_api_error';
            } else if (error?.data) {
                serverMessage = error.data.message || error.data.error || '';
                serverCode = error.data.code;
                errorType = error.data.type || 'otp_data_error';
            } else if (error?.message) {
                serverMessage = error.message;
                errorType = 'otp_network_error';
            }

            console.log('📊 Parsed OTP error:', { serverMessage, serverCode, errorType });

            // Handle specific OTP verification errors with enhanced messaging
            if (serverCode === 400 || serverCode === 401) {
                if (serverMessage?.toLowerCase().includes('invalid') &&
                    serverMessage?.toLowerCase().includes('otp')) {

                    customToast.error("Invalid Verification Code", "Please check the code and try again", 5000);

                } else if (serverMessage?.toLowerCase().includes('expired') ||
                    serverMessage?.toLowerCase().includes('timeout')) {

                    customToast.error("Code Expired", "Please request a new verification code", 5000);

                } else if (serverMessage?.toLowerCase().includes('used') ||
                    serverMessage?.toLowerCase().includes('already verified')) {

                    customToast.error("Code Already Used", "Please request a new code or try logging in", 5000);

                } else {
                    customToast.error("Invalid Code", serverMessage || "Please check your email and try again", 5000);
                }

            } else if (serverCode === 429) {
                customToast.error("Too Many Attempts", serverMessage || "Please wait a few minutes before trying again", 6000);

            } else if (serverCode === 404) {
                customToast.error("Account Issue", serverMessage || "Please try signing up again", 5000);

            } else if (serverCode >= 500) {
                customToast.error("Server Issue", serverMessage || "Please try again in a few moments", 5000);

            } else if (error?.code === 'NETWORK_ERROR' ||
                error?.name === 'NetworkError' ||
                serverMessage?.toLowerCase().includes('network') ||
                serverMessage?.toLowerCase().includes('connection') ||
                error?.message?.toLowerCase().includes('fetch')) {

                customToast.error("Connection Problem", "Please check your internet and try again", 5000);

            } else {
                customToast.error("Verification Failed", serverMessage || "Please try again or request a new code", 5000);
            }

            throw error;
        }
    };

    const handleResendSignupOTP = async () => {
        try {
            console.log('📤 Resending OTP to:', userEmail);
            await authAPI.resendSignupOTP(userEmail);

            customToast.success("New Code Sent", `Verification code sent to ${userEmail}`, 4000);
        } catch (error: any) {
            console.error('❌ Resend OTP Error:', error);

            // Enhanced error message extraction
            const errorMessage = error?.message || error?.data?.message || error?.response?.data?.message || error?.response?.data?.error || '';
            const errorCode = error?.response?.status || error?.data?.code || error?.code;

            console.log('📊 Resend OTP Error Details:', { errorMessage, errorCode });

            // Handle resend OTP errors with enhanced messages
            if (errorMessage.toLowerCase().includes('rate limit') ||
                errorMessage.toLowerCase().includes('too many') ||
                errorMessage.toLowerCase().includes('wait') ||
                errorCode === 429) {

                customToast.error("Please Wait", "Please wait a few minutes before requesting another code", 5000);

            } else if (errorMessage.toLowerCase().includes('user not found') ||
                errorMessage.toLowerCase().includes('email not found') ||
                errorCode === 404) {

                customToast.error("Account Issue", "Please try signing up again", 5000);

            } else if (errorMessage.toLowerCase().includes('network') ||
                errorMessage.toLowerCase().includes('connection') ||
                error?.name === 'NetworkError') {

                customToast.error("Connection Problem", "Please check your internet and try again", 4000);

            } else if (errorMessage.toLowerCase().includes('server') ||
                errorMessage.toLowerCase().includes('500') ||
                errorCode >= 500) {

                customToast.error("Server Issue", "Please try again in a few moments", 5000);

            } else if (errorMessage.toLowerCase().includes('email') &&
                errorMessage.toLowerCase().includes('service')) {

                customToast.error("Email Service Issue", "Please try again later", 5000);

            } else {
                customToast.error("Failed to Send Code", errorMessage || "Please try again", 5000);
            }

            throw error;
        }
    };

    const handleBackToForm = () => {
        setShowOTP(false);
        setUserEmail("");
    };

    const password = form.watch("password");
    const confirmPassword = form.watch("confirmPassword");

    /*~~~~~~~~$ Password Strength Calculation $~~~~~~~~*/
    const passwordStrength = calculatePasswordStrength(password);
    const confirmPasswordStrength = calculatePasswordStrength(confirmPassword);

    React.useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    }, [password, confirmPassword]);

    return (
        <section className="w-full bg-[#f2f7fa] px-[5px] min-h-screen">
            {showOTP ? (
                /* OTP Verification UI */
                <div className="flex items-center justify-center w-full h-full">
                    <OTPVerification
                        email={userEmail}
                        onVerify={handleOTPVerification}
                        onBack={handleBackToForm}
                        resendAction={handleResendSignupOTP}
                        isLoading={isLoading}
                        title={t('OTP.titles.verifyEmail')}
                        description={t('OTP.descriptions.verifyEmailDesc')}
                    />
                </div>
            ) : (
                <div className="relative w-full" ref={containerRef}>
                    {/* Form Container with Responsive Layout */}
                    <div className="w-full bg-white rounded-[20px] relative overflow-hidden">
                        {/* Responsive Layout: Column on small/medium, Row on large screens */}
                        <div className="signup-form-container flex flex-col lg:flex-row">
                            {/* Form Section */}
                            <div className="signup-form-left w-full lg:w-1/2 order-1 lg:order-1">
                                {/* Form Content */}
                                <div className="flex flex-col items-center justify-center gap-[30px] p-6 md:p-10 lg:p-12 w-full">
                                    <div className="flex flex-col w-full items-center gap-8 md:gap-10">
                                        <h1 className="text-[28px] md:text-[34px] lg:text-[38px] text-center font-bold text-[#0f43b4] font-inter leading-tight">
                                            {t("SignUp.title")}
                                        </h1>

                                        <div className="flex flex-col items-center gap-[18px] w-full">
                                            {/* Social Authentication Buttons */}
                                            <SocialAuthButtons />
                                        </div>
                                    </div>

                                    <div className="flex w-full max-w-[450px] items-center gap-2.5">
                                        <div className="flex-1 h-px bg-[#0F43B4]"></div>
                                        <span className="text-[20px] md:text-[22px] lg:text-[24px] font-medium text-[#61e4ae] font-inter px-2">
                                            {t("SignUp.messages.or")}
                                        </span>
                                        <div className="flex-1 h-px bg-[#0F43B4]"></div>
                                    </div>
                                </div>

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(
                                            handleSubmit,
                                            (errors) => {
                                                console.log('Form validation errors:', errors);
                                                scrollToFirstError(errors);

                                                customToast.error(
                                                    "Form Validation Error",
                                                    "Please complete all required fields correctly.",
                                                    5000
                                                );
                                            }
                                        )}
                                        className="flex flex-col gap-6 md:gap-8 lg:gap-10 w-full px-6 md:px-10 lg:px-12 pb-8 md:pb-10">

                                        {/* First Name English */}
                                        <FormField
                                            control={form.control}
                                            name="firstNameEnglish"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full">
                                                    <Label
                                                        htmlFor="firstNameEnglish"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.firstNameEnglish.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <Border>
                                                            <Input
                                                                {...field}
                                                                id="firstNameEnglish"
                                                                className="w-full h-[56px] md:h-[60px] lg:h-[62px] border-none bg-white rounded-[10px] text-left text-[16px] md:text-[17px] lg:text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                                                                placeholder="First Name"
                                                            />
                                                        </Border>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Last Name English */}
                                        <FormField
                                            control={form.control}
                                            name="lastNameEnglish"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full">
                                                    <Label
                                                        htmlFor="lastNameEnglish"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.lastNameEnglish.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <Border>
                                                            <Input
                                                                {...field}
                                                                id="lastNameEnglish"
                                                                className="w-full h-[56px] md:h-[60px] lg:h-[62px] border-none bg-white rounded-[10px] text-left text-[16px] md:text-[17px] lg:text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                                                                placeholder="Last Name"
                                                            />
                                                        </Border>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full">
                                                    <Label
                                                        htmlFor="email"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.email.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <Border>
                                                            <Input
                                                                {...field}
                                                                id="email"
                                                                type="email"
                                                                className="w-full h-[56px] md:h-[60px] lg:h-[62px] border-none bg-white rounded-[10px] text-left text-[16px] md:text-[17px] lg:text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                                                                placeholder="example@gmail.com"
                                                            />
                                                        </Border>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Phone Number */}
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full z-50">
                                                    <Label
                                                        htmlFor="phone"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.phone.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <PhoneInput
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onCountryChange={setSelectedPhoneCountry}
                                                            country={selectedPhoneCountry}
                                                            placeholder="1234567890"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Date of Birth */}
                                        <FormField
                                            control={form.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full">
                                                    <Label
                                                        htmlFor="dateOfBirth"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.dateOfBirth.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <Border>
                                                            <input
                                                                {...field}
                                                                type="date"
                                                                id="dateOfBirth"
                                                                max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]}
                                                                className="w-full h-[56px] md:h-[60px] lg:h-[62px] border-none bg-white rounded-[10px] text-left text-[16px] md:text-[17px] lg:text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] focus:outline-none focus:ring-0 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                                                            />
                                                        </Border>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Gender */}
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col gap-3 w-full">
                                                    <Label className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]">
                                                        {t("SignUp.form.gender.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-row items-center gap-3 sm:gap-4 md:gap-6 w-full"
                                                        >
                                                            <div className="flex items-center gap-2.5 flex-1">
                                                                <Border>
                                                                    <div className={`w-full min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] h-[50px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-200 ${field.value === "male"
                                                                        ? "bg-[#0f43b4]/5"
                                                                        : ""
                                                                        }`}>
                                                                        <span className={`text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal [font-family:'Inter',Helvetica] transition-colors duration-200 ${field.value === "male" ? "text-[#0f43b4] font-semibold" : "text-[#0f43b4]"
                                                                            }`}>
                                                                            {t("SignUp.form.gender.male")}
                                                                        </span>
                                                                    </div>
                                                                </Border>
                                                                <RadioGroupItem
                                                                    value="male"
                                                                    id="male"
                                                                    className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] md:w-[26px] md:h-[26px] lg:w-[30px] lg:h-[30px] border-2 border-[#0f43b4] data-[state=checked]:bg-[#0f43b4] data-[state=checked]:border-[#0f43b4] flex-shrink-0"
                                                                />
                                                            </div>

                                                            <div className="flex items-center gap-2.5 flex-1">
                                                                <Border>
                                                                    <div className={`w-full min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] h-[50px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-200 ${field.value === "female"
                                                                        ? "bg-[#0f43b4]/5"
                                                                        : ""
                                                                        }`}>
                                                                        <span className={`text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal [font-family:'Inter',Helvetica] transition-colors duration-200 ${field.value === "female" ? "text-[#0f43b4] font-semibold" : "text-[#0f43b4]"
                                                                            }`}>
                                                                            {t("SignUp.form.gender.female")}
                                                                        </span>
                                                                    </div>
                                                                </Border>
                                                                <RadioGroupItem
                                                                    value="female"
                                                                    id="female"
                                                                    className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] md:w-[26px] md:h-[26px] lg:w-[30px] lg:h-[30px] border-2 border-[#0f43b4] data-[state=checked]:bg-[#0f43b4] data-[state=checked]:border-[#0f43b4] flex-shrink-0"
                                                                />
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Password */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full">
                                                    <Label
                                                        htmlFor="password"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.password.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <Border>
                                                            <div className="relative w-full h-[56px] md:h-[60px] lg:h-[62px] bg-white rounded-[10px]">
                                                                <Input
                                                                    {...field}
                                                                    id="password"
                                                                    type={showPassword ? "text" : "password"}
                                                                    className="w-full h-full border-none bg-transparent text-left text-[16px] md:text-[17px] lg:text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] pr-[50px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                                                                    placeholder="Enter your password"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-[22px] top-1/2 transform -translate-y-1/2 text-[#b3b3b3] hover:text-[#0f43b4] transition-colors"
                                                                >
                                                                    {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                                </button>
                                                            </div>
                                                        </Border>
                                                    </FormControl>

                                                    {/* Enhanced Password Strength Indicator */}
                                                    {password && (
                                                        <div className="flex flex-col gap-3 w-full mt-2">
                                                            {/* Strength Bar */}
                                                            <div className="relative w-full h-2 bg-[#e9ecef] rounded-[10px] overflow-hidden">
                                                                <div
                                                                    className={`absolute h-full top-0 left-0 rounded-[10px] transition-all duration-300 ease-in-out ${passwordStrength.widthClass} ${passwordStrength.colorClass}`}
                                                                />
                                                            </div>

                                                            {/* Strength Label and Requirements */}
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[14px] font-medium text-[#0f43b4]">
                                                                        Password Strength:
                                                                    </span>
                                                                    <span
                                                                        className={`text-[14px] font-bold ${passwordStrength.label === 'Weak' ? 'text-[#cb0a0a]' : passwordStrength.label === 'Fair' ? 'text-[#f3c50b]' : 'text-[#047537]'}`}
                                                                    >
                                                                        {passwordStrength.label}
                                                                    </span>
                                                                </div>

                                                                {/* Requirements Checklist */}
                                                                <div className="grid grid-cols-2 gap-1 text-[12px]">
                                                                    {passwordStrength.requirements.map((req, index) => (
                                                                        <div key={index} className="flex items-center gap-1">
                                                                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${req.met ? 'bg-[#047537]' : 'bg-[#e9ecef]'}`}>
                                                                                {req.met && (
                                                                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
                                                                            <span className={req.met ? 'text-[#047537]' : 'text-[#898b92]'}>
                                                                                {req.text}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col  gap-[10px] w-full">
                                                    <Label
                                                        htmlFor="confirmPassword"
                                                        className="text-[20px] md:text-[22px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]"
                                                    >
                                                        {t("SignUp.form.confirmPassword.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <Border>
                                                            <div className="relative w-full h-[56px] md:h-[60px] lg:h-[62px] bg-white rounded-[10px]">
                                                                <Input
                                                                    {...field}
                                                                    id="confirmPassword"
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    className="w-full h-full border-none bg-transparent text-left text-[16px] md:text-[17px] lg:text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] pr-[50px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                                                                    placeholder="Confirm your password"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    className="absolute right-[22px] top-1/2 transform -translate-y-1/2 text-[#b3b3b3] hover:text-[#0f43b4] transition-colors"
                                                                >
                                                                    {!showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                                </button>
                                                            </div>
                                                        </Border>
                                                    </FormControl>

                                                    {/* Enhanced Password Match Indicator */}
                                                    {confirmPassword && (
                                                        <div className="flex flex-col gap-3 w-full mt-2">
                                                            {/* Strength Bar */}
                                                            <div className="relative w-full h-2 bg-[#e9ecef] rounded-[10px] overflow-hidden">
                                                                <div
                                                                    className={`absolute h-full top-0 left-0 rounded-[10px] transition-all duration-300 ease-in-out ${confirmPasswordStrength.widthClass} ${confirmPasswordStrength.colorClass}`}
                                                                />
                                                            </div>

                                                            {/* Password Match Indicator */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[14px] font-medium text-[#0f43b4]">
                                                                    Password Match:
                                                                </span>
                                                                <span className={`text-[14px] font-bold ${passwordsMatch && password === confirmPassword ? 'text-[#047537]' : 'text-[#cb0a0a]'}`}>
                                                                    {passwordsMatch && password === confirmPassword ? 'Passwords Match' : 'Passwords Do Not Match'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </div>

                            {/* Image Section - Right Side on Large Screens, Bottom on Small/Medium */}
                            <div className="signup-form-right w-full lg:w-1/2 order-2 lg:order-2">
                                <div ref={imageRef} className="signup-sticky-image w-full flex justify-center items-start p-4 lg:p-6 xl:p-8">
                                    <div className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[550px] 2xl:max-w-[600px] pt-4 lg:pt-8">
                                        <Image
                                            className="w-full h-auto object-cover rounded-[20px] transition-transform duration-300 hover:scale-105"
                                            alt="Registration illustration"
                                            src="/assets/signup/sectionImage.svg"
                                            width={660}
                                            height={434}
                                            style={{ width: 'auto', height: 'auto' }}
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Register Button Outside Form Container */}
                    <div className="flex flex-col items-center justify-center gap-4 md:gap-6 py-20">
                        {/* Create Account Button */}
                        <Button
                            onClick={form.handleSubmit(handleSubmit, (errors) => {
                                // On form validation error, scroll to the first invalid field
                                console.log('Form validation errors:', errors);
                                scrollToFirstError(errors);

                                // Show error toast with validation message
                                customToast.error(
                                    "Please Fix Form Errors",
                                    "Some fields need your attention before you can continue.",
                                    5000
                                );
                            })}
                            disabled={isLoading}
                            className="w-[220px] md:w-[260px] lg:w-[300px] h-[56px] md:h-[60px] px-8 md:px-12 lg:px-16 bg-[#0f43b4] rounded-[10px] border border-solid border-white text-white font-inter text-[20px] md:text-[22px] lg:text-[24px] font-bold hover:bg-[#0d3a9a] transition-colors shadow-[0px_4px_20px_rgba(0,0,0,0.25)]"
                        >
                            {isLoading ? "Creating Account..." : t("SignUp.buttons.signUp")}
                        </Button>

                        {/* Already have an account - Log in here */}
                        <div className="flex items-center gap-2.5 justify-center flex-wrap text-center">
                            <span className="text-[#0f43b4] text-[16px] md:text-[18px] font-inter leading-[22px]">
                                {t("SignUp.messages.alreadyHaveAccount")}
                            </span>
                            <Link href="/login">
                                <span className="text-[#61e4ae] text-[16px] md:text-[18px] font-inter leading-[22px] cursor-pointer hover:underline transition-all">
                                    {t("SignUp.messages.loginHere")}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};