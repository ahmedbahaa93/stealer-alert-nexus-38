import React from "react";
import { InvoiceData } from '@/lib/api/invoice';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface MainContentSectionProps {
    invoiceData: InvoiceData;
}

export const MainContentSection: React.FC<MainContentSectionProps> = ({ invoiceData }) => {
    const t = useTranslations('invoice');

    // Company information data
    const companyInfo = {
        name: t('companyInfo.name'),
        address: t('companyInfo.address'),
        crNumber: t('companyInfo.crNumber'),
        phone: t('companyInfo.phone'),
        email: t('companyInfo.email'),
    };

    // Generate invoice details from API data
    const invoiceDetails = {
        number: `#INV${invoiceData._id.slice(-6).toUpperCase()}`,
        date: format(new Date(invoiceData.paymentInfo.createdAt || new Date()), "dd/MM/yyyy"),
        projectTitle: invoiceData.courseInfo.title || "Course Training",
        projectDescription: `${invoiceData.paymentInfo.payment_status || 'Online'} training course - Payment for course enrollment and access`,
    };

    // Client information from user data
    const clientInfo = {
        name: `${invoiceData.userInfo.first_name} ${invoiceData.userInfo.last_name}`,
        email: invoiceData.userInfo.email,
        phone: invoiceData.userInfo.phone_number || '',
        gender: invoiceData.userInfo.gender || '',
    };

    return (
        <Card className="w-full relative mb-6">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-12">
                    {/* Company Information */}
                    <div className="space-y-3">
                        <h2 className="text-3xl text-gray-600 font-medium">
                            {companyInfo.name}
                        </h2>
                        <p className="text-base text-gray-500 leading-relaxed">
                            {companyInfo.address}
                            <br />
                            {companyInfo.crNumber}
                        </p>
                        <p className="text-base text-gray-600">
                            {companyInfo.phone}
                        </p>
                        <p className="text-base text-blue-600">
                            {companyInfo.email}
                        </p>
                    </div>

                    {/* Invoice Title */}
                    <h1 className="text-3xl text-gray-500 font-bold">
                        {t('title').toUpperCase()}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Client Information */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                            {t('billTo')}
                        </p>
                        <div className="relative">
                            <p className="text-base text-gray-700 mt-2">
                                {clientInfo.name}
                            </p>
                        </div>
                        <p className="text-base text-gray-600">
                            {clientInfo.email}
                        </p>
                        <p className="text-base text-gray-600">
                            {clientInfo.phone}
                        </p>
                        <p className="text-base text-gray-600">
                            {clientInfo.gender}
                        </p>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">
                            {t('projectDetails')}
                        </p>
                        <div className="relative">
                            <p className="text-base text-gray-600 text-right mt-2">
                                {invoiceDetails.projectTitle}
                            </p>
                        </div>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {invoiceDetails.projectDescription}
                        </p>

                        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-700 font-semibold">
                                    {t('invoiceNo')}
                                </p>
                                <p className="text-sm text-gray-700 font-semibold">
                                    {t('invoiceDate')}
                                </p>
                            </div>
                            <div className="text-right space-y-2">
                                <p className="text-sm text-gray-600">
                                    {invoiceDetails.number}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {invoiceDetails.date}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
