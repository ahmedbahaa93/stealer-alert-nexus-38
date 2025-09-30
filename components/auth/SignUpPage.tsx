"use client";

import { useLocale } from "next-intl";
import { SignUpHeader } from "@/components/auth/SignUpHeader";
import { SignUpFormSection } from "@/components/auth/SignUpFormSection";
import PageTransition from "@/components/auth/PageTransition";

export default function SignUpPage() {
    /*~~~~~~~~$ Internationalization and State Management $~~~~~~~~*/
    const locale = useLocale();
    const isRTL = locale === "ar";

    /*~~~~~~~~$ Main Component JSX $~~~~~~~~*/
    return (
        <main className="signup-page w-full bg-[#f2f7fa] min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
            <PageTransition>
                {/*~~~~~~~~$ Custom SignUp Header (No Main Navigation) $~~~~~~~~*/}
                <SignUpHeader />
                {/*~~~~~~~~$ SignUp Form Section with All Fields $~~~~~~~~*/}
                <SignUpFormSection />
            </PageTransition>
        </main>
    );
}
