import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

const Failed = () => {
    const t = useTranslations("FailedPage");
    const locale = useLocale();

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Top right wave pattern */}
            <div className="absolute top-2 right-0 w-60 h-52 md:w-[530px] md:h-[430px] opacity-70">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={530}
                    height={430}
                />
            </div>

            {/* Bottom left wave pattern */}
            <div className="absolute -bottom-9 left-4 w-40 h-40 md:w-64 md:h-64 opacity-70">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={64}
                    height={64}
                />
            </div>

            {/* Main content container */}
            <div className="flex items-center justify-center min-h-screen gap-4">
                <div className="relative max-w-2xl flex flex-col items-center ">

                    {/* Center content - no balloons */}
                    <div className="relative flex flex-col items-center">
                        {/* Header section */}
                        <div className="relative flex flex-col items-center justify-center">

                            <h1 className="text-xl sm:text-3xl md:text-6xl font-bold text-red-500">
                                {t("title")}
                            </h1>

                            <h2 className="text-base sm:text-xl md:text-5xl text-red-500 mb-2">
                                {t("subtitle")}
                            </h2>
                            <p className="text-xs sm:text-base md:text-lg text-red-500 mb-3">
                                {t("message")}
                            </p>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 ">
                                <Image
                                    src="/assets/failed/red-x-icon 1.svg"
                                    alt="failed x mark"
                                    className="w-full h-full object-contain"
                                    width={12}
                                    height={12}
                                />
                            </div>
                        </div>

                        {/* Sad robot */}
                        <div className="relative">
                            <div className="w-40 h-60 sm:w-48 sm:h-72 md:w-[300px] md:h-[460px] -translate-y-2 sm:-translate-y-4 md:-translate-y-9">
                                <Image
                                    src="/assets/failed/sad-robot.svg"
                                    alt="sad robot"
                                    className="w-full h-full object-contain"
                                    width={300}
                                    height={460}
                                />
                            </div>


                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pb-5 justify-around w-full items-center md:-translate-y-14">
                            <Link href={`/${locale}`} className="flex items-center gap-3 px-6 py-2 shadow-sm shadow-black sm:px-8 sm:py-3 border-2 border-[#0F43B4] text-[#0F43B4] rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium text-sm sm:text-lg min-w-[120px] sm:min-w-[140px] justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                {t("buttons.back")}
                            </Link>
                            <button className="flex items-center gap-3 shadow-sm shadow-black px-8 py-2 sm:px-8 sm:py-3 border-2 border-[#0F43B4] text-[#0F43B4] rounded-lg hover:bg-red-50 transition-all duration-200 font-medium text-sm sm:text-lg min-w-[120px] sm:min-w-[140px] justify-center">
                                <Image
                                    src="/assets/failed/exchange-refresh-icon 1.svg"
                                    alt="refresh icon"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    width={20}
                                    height={20}
                                />
                                {t("buttons.tryAgain")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help button - bottom right */}
            <div className="fixed bottom-8 right-8 z-30">
                <Image
                    src="/images/success/Frame 8489.svg"
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    alt="help button"
                    width={48}
                    height={48}
                />
            </div>
        </div>
    );
};

export default Failed;
