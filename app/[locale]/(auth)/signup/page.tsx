import SignUpPage from "@/components/auth/SignUpPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "SignUp" });

    return {
        title: `${t("title")} | RiseUp`,
        description: t("subtitle"),
        keywords: [
            "sign up",
            "register",
            "create account",
            "online learning",
            "education platform",
            "courses",
            "programming",
            "learning",
        ],
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: `${t("title")} | RiseUp`,
            description: t("subtitle"),
            type: "website",
            locale: locale,
        },
        twitter: {
            card: "summary_large_image",
            title: `${t("title")} | RiseUp`,
            description: t("subtitle"),
        },
        alternates: {
            canonical: `/signup`,
            languages: {
                en: "/en/signup",
                ar: "/ar/signup",
            },
        },
    };
}

export default async function Page({ params }: Props) {
    await params; // Ensure params are awaited for Next.js

    return <SignUpPage />;
}
