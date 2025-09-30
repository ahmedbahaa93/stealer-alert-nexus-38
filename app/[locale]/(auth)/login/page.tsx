import LoginPage from "@/components/auth/LoginPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Login" });

    return {
        title: `${t("title")} | RiseUp`,
        description: t("subtitle"),
        keywords: [
            "login",
            "sign in",
            "authentication",
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
            locale,
        },
        twitter: {
            card: "summary_large_image",
            title: `${t("title")} | RiseUp`,
            description: t("subtitle"),
        },
        alternates: {
            canonical: `/${locale}/login`,
            languages: {
                en: "/en/login",
                ar: "/ar/login",
            },
        },
    };
}

export default function Page() {
    return <LoginPage />;
}
