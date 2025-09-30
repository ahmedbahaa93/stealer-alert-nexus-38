import { useTranslations } from "next-intl";
import Image from "next/image";
import { Mail } from "lucide-react";

// Import the images from the public folder
const Policy = () => {
    const t = useTranslations("PolicyPage");

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-3 -right-12 lg:w-[500px] lg:h-[400px] w-[200px] h-[150px] ">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={500}
                    height={400}
                />
            </div>
            <div className="absolute -bottom-36 -left-6  lg:w-[300px] lg:h-[250px]  w-[150px] h-[100px] ">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={300}
                    height={250}
                />
            </div>
            <div className="absolute bottom-64 -right-5 lg:w-[500px] lg:h-[500px] w-[200px] h-[200px] ">
                <Image
                    src="/images/success/Topology-1.svg"
                    alt="vector pattern"
                    className="w-full h-full object-contain"
                    width={500}
                    height={500}
                />
            </div>
            {/* Main content */}
            <div className="relative z-10 mx-auto px-10 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="lg:w-[100px] lg:h-[123px] w-[80px] h-[60px] flex items-center justify-center">
                            <Image
                                src="/images/policy/shield-sedo-line-icon 1.svg"
                                alt="shield icon"
                                width={100}
                                height={123}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0F43B4]">{t("title")}</h1>
                    </div>
                    <p className="text-[#0F43B4] lg:text-lg md:text-md text-sm max-w-4xl mx-auto text-start leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>
                {/* Section 1: Information We Collect */}
                <div className="px-6 ">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-5 items-center ">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                                <Image
                                    src="/images/policy/personal-information-icon 1.svg"
                                    alt="information icon"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-[#0F43B4]">{t("sections.information.title")}</h2>
                        </div>
                        <div className="flex-1">
                            <div className="space-y-2 text-gray-500 text-sm">
                                <p className="text-sm text-green-300 pb-3 font-semibold">{t("sections.information.subtitle")}</p>
                                <p>{t("sections.information.description")}</p>
                                <ul className="list-inside space-y-1 text-sm">
                                    {t.raw("sections.information.list").map((item: string, index: number) => (
                                        <li key={index}>- {item}</li>
                                    ))}
                                </ul>
                                <p className="mt-3 text-sm">
                                    {t("sections.information.additional")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 2: How We Use Your Information */}
                <div className="px-6 py-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-5 items-center">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                                <Image
                                    src="/images/policy/personal-info-icon 1.svg"
                                    alt="user icon"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <p className="text-lg font-semibold text-[#0F43B4]">{t("sections.usage.title")}</p>
                        </div>

                        <div className="flex-1">
                            <div className="space-y-2 text-gray-500 text-sm">
                                <ul className="list-inside space-y-1 text-sm">
                                    {t.raw("sections.usage.list").map((item: string, index: number) => (
                                        <li key={index}>- {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Sharing Your Information */}
                <div className="px-6 py-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-5 items-center">
                            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-1">
                                <Image
                                    src="/images/policy/Group(1).svg"
                                    alt="sharing icon"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-[#0F43B4]">{t("sections.sharing.title")}</h2>
                        </div>
                        <div className="flex-1">
                            <div className="space-y-2 text-gray-500 text-sm">
                                <p>{t("sections.sharing.description")}</p>
                                <ul className="list-inside space-y-1 text-sm">
                                    {t.raw("sections.sharing.list").map((item: string, index: number) => (
                                        <li key={index}>- {item}</li>
                                    ))}
                                </ul>
                                <p className="mt-3 text-sm max-w-5xl">
                                    {t("sections.sharing.additional")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Your Rights */}
                <div className="px-6 py-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-5 items-center">
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                <Image
                                    src="/images/policy/durable-icon 1.svg"
                                    alt="rights icon"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-[#0F43B4]">{t("sections.rights.title")}</h2>
                        </div>
                        <div className="flex-1">
                            <div className="space-y-2 text-gray-500 text-sm">
                                <p>{t("sections.rights.description")}</p>
                                <ul className="list-inside space-y-1 text-sm">
                                    {t.raw("sections.rights.list").map((item: string, index: number) => (
                                        <li key={index}>- {item}</li>
                                    ))}
                                </ul>
                                <p className="mt-3 text-sm">
                                    {t("sections.rights.additional")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section 5: Contact Us */}
                <div className="px-6 py-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-5 items-center">
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                <Image
                                    src="/images/policy/Vector.svg"
                                    alt="contact icon"
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-[#0F43B4]">{t("sections.contact.title")}</h2>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">{t("sections.contact.contactTitle")}</h2>
                            <div className="space-y-8 text-gray-600 max-w-5xl text-sm">
                                <p>{t("sections.contact.description")}</p>
                                <div className="mt-3">
                                    <p className="font-medium flex items-center gap-2 text-[#0F43B4]">
                                        <Mail color="black" size={20} />
                                        {t("sections.contact.email")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consent Section */}
                <div className="px-6 py-3 space-y-5 mb-10">
                    <h3 className="font-bold text-black mb-3 text-sm">{t("consent.title")}</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            id="privacy-consent"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="privacy-consent" className="text-sm text-gray-600">
                            {t("consent.checkbox")}
                        </label>
                    </div>
                </div>
                <div className="flex w-full justify-end pr-14">
                    <button className="flex items-center gap-3 shadow-sm shadow-black px-8 py-2 sm:px-8 sm:py-2 border-2 border-[#0F43B4] text-[#0F43B4] rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium text-sm sm:text-lg min-w-[120px] sm:min-w-[140px] justify-center">
                        {t("buttons.continue")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Policy;
