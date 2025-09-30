"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

interface BlogDetailPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { id, locale } = use(params);
    const router = useRouter();

    useEffect(() => {
        // Redirect to articles page instead of showing blog detail placeholder
        router.replace(`/${locale}/articles/${id}`);
    }, [id, locale, router]);

    return (
        <div className="common-bg">
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to article...</p>
                </div>
            </div>
        </div>
    );
}
