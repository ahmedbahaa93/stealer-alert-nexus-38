"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import Image from "next/image";

export const SignUpHeader = () => {
    /*~~~~~~~~$ Translation and Pathname Hooks $~~~~~~~~*/
    const t = useTranslations();
    const pathname = usePathname();

    /*~~~~~~~~$ Determine current page $~~~~~~~~*/
    const isLoginPage = pathname.includes('/login');
    const isSignupPage = pathname.includes('/signup');

    /*~~~~~~~~$ Custom Header JSX (No Main Site Navigation) $~~~~~~~~*/
    return (
        <header className="flex w-full items-center justify-between py-3 md:py-8 px-4 md:px-6 lg:px-10 bg-[#f2f7fa]">
            {/*~~~~~~~~$ Logo Section with Gradient Text $~~~~~~~~*/}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                    className="h-12 w-auto object-contain"
                    alt="RaiseUp Logo"
                    src="/AuthHeaderLogo.svg"
                    width={160}
                    height={48}
                    priority
                />
            </Link>

            {/*~~~~~~~~$ Right Section with Navigation Buttons $~~~~~~~~*/}
            <div className="flex items-center gap-[10px] md:gap-[15px] lg:gap-[30px]">
                {/*~~~~~~~~$ Navigation Buttons (Login/SignUp) $~~~~~~~~*/}
                <div className="flex items-center gap-[10px] md:gap-[15px] lg:gap-[30px]">                    <Link href="/login">
                    <Button
                        variant={isLoginPage ? "default" : "outline"}
                        className={`min-w-[60px] md:min-w-[80px] lg:min-w-[100px] px-2 md:px-3 lg:px-4 h-[32px] md:h-[40px] lg:h-[48px] rounded-[8px] border-2 border-solid font-bold text-[12px] md:text-[14px] lg:text-[16px] font-inter transition-all duration-500 ease-in-out transform ${isLoginPage
                            ? "bg-[#0f43b4] border-[#0f43b4] shadow-[0px_4px_20px_rgba(0,0,0,0.25)] text-white hover:bg-[#0d3a9a] scale-105"
                            : "bg-white border-[#0f43b4] text-[#0f43b4] hover:bg-[#f8f9fa] hover:scale-102"
                            }`}
                    >
                        {t('Layout.nav.login')}
                    </Button>
                </Link>

                    <Link href="/signup">
                        <Button
                            variant={isSignupPage ? "default" : "outline"}
                            className={`min-w-[60px] md:min-w-[80px] lg:min-w-[100px] px-2 md:px-3 lg:px-4 h-[32px] md:h-[40px] lg:h-[48px] rounded-[8px] border-2 border-solid font-bold text-[12px] md:text-[14px] lg:text-[16px] font-inter transition-all duration-500 ease-in-out transform ${isSignupPage
                                ? "bg-[#0f43b4] border-[#0f43b4] shadow-[0px_4px_20px_rgba(0,0,0,0.25)] text-white hover:bg-[#0d3a9a] scale-105"
                                : "bg-white border-[#0f43b4] text-[#0f43b4] hover:bg-[#f8f9fa] hover:scale-102"
                                }`}
                        >
                            {t('Layout.nav.signUp')}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};
