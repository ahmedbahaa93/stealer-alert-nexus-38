"use client";

import { useLocale } from "next-intl";
import { SignUpHeader } from "@/components/auth/SignUpHeader";
import { LoginFormSection } from "@/components/auth/LoginFormSection";
import PageTransition from "@/components/auth/PageTransition";

export default function LoginPage() {
    /*~~~~~~~~$ Internationalization and State Management $~~~~~~~~*/
    const locale = useLocale();
    const isRTL = locale === "ar";

    /*~~~~~~~~$ Main Component JSX $~~~~~~~~*/
    return (
        <main className="login-page w-full bg-[#f2f7fa] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
            <PageTransition>
                {/*~~~~~~~~$ Custom SignUp Header (No Main Navigation) $~~~~~~~~*/}
                <SignUpHeader />
                {/*~~~~~~~~$ Login Form Section with All Fields $~~~~~~~~*/}
                <LoginFormSection />
            </PageTransition>
        </main>
    );
}
