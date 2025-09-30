"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useCustomToast } from "@/components/ui/CustomToastProvider";
import Border from "@/components/auth/Border";
import { authAPI } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useRememberMe } from "@/lib/utils/rememberMe";

// Form validation schema
const createLoginSchema = (t: any) =>
    z.object({
        email: z
            .string()
            .min(1, t("Login.validation.emailRequired"))
            .email(t("Login.validation.emailInvalid")),
        password: z
            .string()
            .min(8, t("Login.validation.passwordMinLength")),
        rememberMe: z.boolean().optional(),
    });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export const LoginFormSection = () => {
    /*~~~~~~~~$ Translation and State Management $~~~~~~~~*/
    const t = useTranslations();
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const customToast = useCustomToast();
    const { saveCredentials, getSavedCredentials, clearCredentials } = useRememberMe();

    /*~~~~~~~~$ Component State $~~~~~~~~*/
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [serverErrors, setServerErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});

    /*~~~~~~~~$ Form Configuration with Validation $~~~~~~~~*/
    const form = useForm<LoginFormData>({
        resolver: zodResolver(createLoginSchema(t)),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    // Load saved credentials on component mount
    useEffect(() => {
        const savedCredentials = getSavedCredentials();
        if (savedCredentials) {
            form.setValue("email", savedCredentials.email);
            form.setValue("rememberMe", savedCredentials.rememberMe);
        }
    }, [form, getSavedCredentials]);

    // Clear server errors when form values change
    useEffect(() => {
        const subscription = form.watch(() => {
            if (Object.keys(serverErrors).length > 0) {
                setServerErrors({});
            }
        });

        return () => subscription.unsubscribe();
    }, [form, serverErrors]);

    /*~~~~~~~~$ Regular Login Handler $~~~~~~~~*/
    const handleSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        // Clear any previous server errors
        setServerErrors({});

        try {
            const response = await authAPI.login({
                email: data.email,
                password: data.password
            });

            if (response.status === "success" && response.data?.user && response.access_token) {
                // Save credentials if remember me is checked
                saveCredentials(data.email, data.rememberMe || false);

                // Direct login without OTP verification
                login(response.data.user, response.access_token, undefined, data.rememberMe);

                customToast.success(
                    "🎉 Welcome Back!",
                    `Login successful! Welcome back, ${response.data.user.first_name}!`,
                    5000
                );

                router.push("/"); // Redirect to home page
            }
        } catch (error: any) {
            // Extract error message
            let errorMessage = '';
            if (error?.message) {
                errorMessage = error.message;
            } else if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            // Email-related errors
            if (errorMessage.toLowerCase().includes('invalid') &&
                (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('password'))) {
                customToast.error(
                    "🔐 Invalid Credentials",
                    "The email or password you entered is incorrect. Please double-check and try again.",
                    6000
                );

                // Set specific field errors and general error
                setServerErrors({
                    email: "Invalid email or password",
                    password: "Invalid email or password",
                    general: "The email address or password you entered is incorrect. Please check your credentials and try again."
                });
            }
            // User not found
            else if (errorMessage.toLowerCase().includes('not found') ||
                errorMessage.toLowerCase().includes('no account')) {
                customToast.error(
                    "👤 Account Not Found",
                    "No account exists with this email address. Would you like to create one?",
                    6000
                );

                setServerErrors({
                    email: "No account found with this email",
                    general: "No account exists with this email address. Please check your email or sign up for a new account."
                });
            }
            // Network errors
            else if (errorMessage.toLowerCase().includes('network') ||
                errorMessage.toLowerCase().includes('connection')) {
                customToast.error(
                    "🌐 Connection Problem",
                    "Please check your internet connection and try again.",
                    5000
                );
            }
            // Server errors
            else if (errorMessage.toLowerCase().includes('server') ||
                errorMessage.toLowerCase().includes('500')) {
                customToast.error(
                    "🔧 Server Issue",
                    "Our servers are experiencing issues. Please try again in a few moments.",
                    6000
                );
            }
            // Rate limiting
            else if (errorMessage.toLowerCase().includes('too many') ||
                errorMessage.toLowerCase().includes('rate limit')) {
                customToast.error(
                    "🚫 Too Many Attempts",
                    "Please wait a few minutes before trying again.",
                    8000
                );
            }
            // Generic error
            else {
                customToast.error(
                    "❌ Login Failed",
                    errorMessage || "Something went wrong. Please try again.",
                    6000
                );

                // Set general error for any other login failures
                setServerErrors({
                    general: errorMessage || "Login failed. Please check your credentials and try again."
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center gap-[50px] py-10 w-full bg-[#f3f8fb]">
            {/* Login Form UI */}
            <>
                {/* Main Container with specified dimensions and padding */}
                <div className="w-full max-w-[1600px] h-auto min-h-[686px] bg-white rounded-[20px] shadow-lg mx-auto p-6 lg:p-8 xl:p-12">
                    <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-[37px] w-full">
                        {/* Login Form Section */}
                        <div className="flex flex-col w-full lg:w-auto items-center lg:items-start gap-[30px] flex-1">
                            <div className="flex flex-col items-center justify-center gap-[30px] w-full max-w-[608px]">
                                <div className="flex flex-col w-full items-center gap-8">
                                    <h1 className="text-[28px] lg:text-[38px] text-center font-bold text-[#0f43b4] font-inter leading-[34px] lg:leading-[46px]">
                                        {t("Login.title")}
                                    </h1>

                                    <div className="flex flex-col items-center gap-[18px] w-full">


                                        {/* Social Authentication Buttons */}
                                        <SocialAuthButtons />
                                    </div>
                                </div>

                                <div className="flex w-full max-w-[450px] items-center gap-2.5">
                                    <div className="flex-1 h-px bg-[#0F43B4]"></div>

                                    <div className="flex-1 h-px bg-[#0F43B4]"></div>
                                </div>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col items-center gap-6 w-full max-w-[608px]">
                                    {/* Email Input */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start gap-[10px] w-full">
                                                <Label className="text-[20px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[24px] lg:leading-[29px]">
                                                    {t("Login.form.email.label")}
                                                </Label>
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Border>
                                                            <Input
                                                                {...field}
                                                                type="email"
                                                                id="email"
                                                                disabled={isLoading}
                                                                onFocus={() => {
                                                                    setIsEmailFocused(true);
                                                                    // Clear server errors on focus
                                                                    setServerErrors(prev => ({ ...prev, email: undefined, general: undefined }));
                                                                }}
                                                                onBlur={() => setIsEmailFocused(false)}
                                                                className={`w-[608px] max-w-full h-[62px] border-none bg-white rounded-[10px] text-left text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] pr-[120px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${serverErrors.email ? 'border-2 border-red-500' : ''} ${isLoading ? 'opacity-50' : ''}`}
                                                                placeholder={t("Login.form.email.placeholder")}
                                                            />
                                                        </Border>
                                                        {!isEmailFocused && !field.value && (
                                                            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                                                                @gmail.com
                                                            </span>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                                {serverErrors.email && (
                                                    <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                                            <span className="text-white text-xs">!</span>
                                                        </div>
                                                        <p className="text-red-700 text-sm font-medium">{serverErrors.email}</p>
                                                    </div>
                                                )}
                                            </FormItem>
                                        )}
                                    />

                                    {/* Password Input */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start gap-4 w-full">
                                                <div className="flex flex-col items-start gap-[10px] w-full">
                                                    <Label className="text-[20px] lg:text-[24px] font-normal text-[#0f43b4] font-inter leading-[24px] lg:leading-[29px]">
                                                        {t("Login.form.password.label")}
                                                    </Label>
                                                    <FormControl>
                                                        <div className="relative w-full">
                                                            <Border>
                                                                <div className="relative w-[608px] max-w-full h-[62px] bg-white rounded-[10px]">
                                                                    <Input
                                                                        {...field}
                                                                        id="password"
                                                                        type={showPassword ? "text" : "password"}
                                                                        disabled={isLoading}
                                                                        onFocus={() => {
                                                                            // Clear server errors on focus
                                                                            setServerErrors(prev => ({ ...prev, password: undefined, general: undefined }));
                                                                        }}
                                                                        className={`w-full h-full border-none bg-transparent text-left text-[18px] font-light text-[#333] font-inter py-[20px] px-[22px] pr-[50px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${serverErrors.password ? 'border-2 border-red-500' : ''} ${isLoading ? 'opacity-50' : ''}`}
                                                                        placeholder={t("Login.form.password.placeholder")}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        disabled={isLoading}
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                                                                    >
                                                                        {!showPassword ? (
                                                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                                        ) : (
                                                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </Border>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                    {serverErrors.password && (
                                                        <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                                                <span className="text-white text-xs">!</span>
                                                            </div>
                                                            <p className="text-red-700 text-sm font-medium">{serverErrors.password}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>

                            {/* General Error Message */}
                            {serverErrors.general && (
                                <div className="w-full max-w-[608px] mt-4">
                                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">!</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-red-800 font-semibold text-sm mb-1">
                                                Login Failed
                                            </h4>
                                            <p className="text-red-700 text-sm leading-relaxed">
                                                {serverErrors.general}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            title="Dismiss error message"
                                            aria-label="Dismiss error message"
                                            onClick={() => setServerErrors(prev => ({ ...prev, general: undefined }))}
                                            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between gap-3 mt-4 w-full max-w-[608px]">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        type="checkbox"
                                        disabled={isLoading}
                                        {...form.register("rememberMe")}
                                        className={`w-4 h-4 text-[#0f43b4] bg-gray-100 border-gray-300 rounded focus:ring-[#0f43b4] focus:ring-2 ${isLoading ? 'opacity-50' : ''}`}
                                    />
                                    <label htmlFor="rememberMe" className={`ml-2 text-sm font-medium text-gray-700 cursor-pointer ${isLoading ? 'opacity-50' : ''}`}>
                                        {t("Login.form.rememberMe")}
                                    </label>
                                </div>

                                {/* Clear saved login option */}
                                {getSavedCredentials() && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearCredentials();
                                            form.setValue("email", "");
                                            form.setValue("rememberMe", false);
                                            customToast.success("Saved login cleared", "Your saved login information has been removed", 3000);
                                        }}
                                        className="text-xs text-red-600 hover:text-red-800 underline transition-colors"
                                    >
                                        Clear saved login
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Login Image Section */}
                        <div className="hidden lg:flex w-full lg:w-auto lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[660px] h-auto items-center justify-center flex-shrink-0">
                            <div className="relative w-full h-auto flex items-center justify-center p-4">
                                <Image
                                    className="w-full h-auto max-w-[400px] lg:max-w-[450px] xl:max-w-[550px] 2xl:max-w-[660px] object-contain transition-transform duration-300 hover:scale-105"
                                    alt="Login illustration"
                                    src="/assets/signup/sectionImage.svg"
                                    width={660}
                                    height={433}
                                    priority
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </div>

                        {/* Mobile Image - Shown only on small/medium screens */}
                        <div className="lg:hidden flex justify-center items-center p-4 w-full">
                            <div className="w-full max-w-[250px] sm:max-w-[320px] md:max-w-[400px]">
                                <Image
                                    className="w-full h-auto object-contain rounded-[20px] transition-transform duration-300 hover:scale-105"
                                    alt="Login illustration"
                                    src="/assets/signup/sectionImage.svg"
                                    width={660}
                                    height={433}
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Button and Register Link - Outside Container */}
                <div className="flex flex-col items-center gap-4 w-full py-6">
                    {/* Login Button */}
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={isLoading || isLoading}
                        className={`w-[140px] h-[60px] px-[52px] py-[7px] bg-gradient-to-r from-[#0f43b4] to-[#1a5bc4] text-white rounded-[10px] shadow-lg hover:shadow-xl font-bold text-lg transition-all duration-300 transform ${isLoading || isLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-[1.02]'
                            }`}
                    >
                        {isLoading ? "Loading..." : t("Login.buttons.login")}
                    </Button>

                    {/* Register Link */}
                    <div className="text-center">
                        <span className="text-[#0f43b4] font-semibold text-base lg:text-lg">
                            {t("Login.messages.dontHaveAccount")}{" "}
                        </span>
                        <Link
                            href="/signup"
                            className="text-[#61e4ae] font-bold text-base lg:text-lg hover:text-[#4fd49a] transition-colors"
                        >
                            {t("Login.messages.registerHere")}
                        </Link>
                    </div>
                </div>
            </>
        </section>
    );
};

/*~~~~~~~~$ Export $~~~~~~~~*/
export default LoginFormSection;