'use client';

import { Skeleton } from "@/components/ui/skeleton";
import Heading from "../Heading";
import { useTranslations } from "next-intl";

const PaymentsSkeleton = () => {
    const t = useTranslations('payment');

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <Heading data={t('title')} />
                <Skeleton className="h-10 w-[180px]" />
            </div>

            {/* Skeleton for monthly payment cards - show 3 months */}
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="mb-6">
                    {/* Date header */}
                    <Skeleton className="h-8 w-48 mb-4" />

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        {/* Payment records - show 2-3 per month */}
                        {Array.from({ length: idx === 0 ? 3 : 2 }).map((_, pIdx) => (
                            <div key={pIdx} className="mb-6 last:mb-0">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-md" />
                                        <Skeleton className="h-6 w-40" />
                                    </div>
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                </div>
                                {pIdx < (idx === 0 ? 2 : 1) && <div className="mt-6 border-b border-gray-100" />}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Pagination skeleton */}
            <div className="flex justify-center mt-8">
                <Skeleton className="h-10 w-64" />
            </div>
        </>
    );
};

export default PaymentsSkeleton;