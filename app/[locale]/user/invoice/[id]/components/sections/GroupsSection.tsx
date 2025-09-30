import React from "react";
import { InvoiceData } from '@/lib/api/invoice';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface GroupsSectionProps {
    invoiceData: InvoiceData;
}

export const GroupsSection: React.FC<GroupsSectionProps> = ({ invoiceData }) => {
    const t = useTranslations('invoice');

    // Bank details data
    const bankDetails = {
        beneficiaryName: t('bankInfo.beneficiaryName'),
        bankName: t('bankInfo.bankName'),
        accountDetails: t('bankInfo.accountDetails'),
        currency: t('bankInfo.currency'),
    };

    // Generate invoice item data from API
    const courseTitle = invoiceData.courseInfo.title || "Course Training";
    const startDate = format(new Date(invoiceData.paymentInfo.selected_start_date || new Date()), "MMM d, yyyy");
    const endDate = format(new Date((new Date(invoiceData.paymentInfo.selected_start_date || new Date()).getTime()) + (30 * 24 * 60 * 60 * 1000)), "MMM d, yyyy");

    const invoiceItem = {
        description: `${courseTitle}\n${t('startDate')} ${startDate}\n${t('endDate')} ${endDate}\n${t('location')} ${t('onlinePlatform')}\n${t('paymentMethod')} ${invoiceData.paymentInfo.payment_getway || t('onlinePlatform')}`,
        quantity: "1", // Single course enrollment
        unitPrice: invoiceData.paymentInfo.initial_payment_amount?.toFixed(2) || "0.00",
        total: invoiceData.paymentInfo.initial_payment_amount?.toFixed(2) || "0.00",
    };

    // Calculate summary data from API
    const subtotal = invoiceData.paymentInfo.initial_payment_amount || 0;
    const discount = 0; // No discount info in API
    const subtotalLessDiscount = subtotal - discount;
    const taxRate = 0; // No tax info in API
    const totalTax = (subtotalLessDiscount * taxRate) / 100;
    const balanceDue = subtotalLessDiscount + totalTax;

    const summary = [
        { label: t('subtotal').toUpperCase(), value: subtotal.toFixed(2) },
        { label: t('discount').toUpperCase(), value: discount.toFixed(2) },
        { label: t('subtotalLessDiscount').toUpperCase(), value: subtotalLessDiscount.toFixed(2) },
        { label: t('taxRate').toUpperCase(), value: `${taxRate.toFixed(2)}%` },
        { label: t('totalTax').toUpperCase(), value: totalTax.toFixed(2) },
    ];

    return (
        <div className="w-full mt-6">
            <Card className="relative w-full bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                    {/* Invoice table */}
                    <div className="w-full mb-8">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-2 border-gray-200">
                                    <TableHead className="font-medium text-gray-600 text-sm py-4 px-4">
                                        {t('description')}
                                    </TableHead>
                                    <TableHead className="font-medium text-gray-600 text-sm text-center py-4 px-4">
                                        {t('qty')}
                                    </TableHead>
                                    <TableHead className="font-medium text-gray-600 text-sm py-4 px-4">
                                        {t('unitPrice')}
                                    </TableHead>
                                    <TableHead className="font-medium text-gray-600 text-sm text-right py-4 px-4">
                                        {t('total')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b border-gray-100">
                                    <TableCell className="text-gray-700 text-base whitespace-pre-line align-top py-6 px-4 leading-relaxed">
                                        {invoiceItem.description}
                                    </TableCell>
                                    <TableCell className="text-gray-700 text-base text-center py-6 px-4">
                                        {invoiceItem.quantity}
                                    </TableCell>
                                    <TableCell className="text-gray-700 text-base py-6 px-4">
                                        EGP {invoiceItem.unitPrice}
                                    </TableCell>
                                    <TableCell className="text-gray-700 text-base text-right py-6 px-4 font-medium">
                                        EGP {invoiceItem.total}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary section */}
                    <div className="flex flex-col items-end mb-8">
                        <div className="w-80 space-y-3">
                            {summary.map((item, index) => (
                                <div
                                    key={`summary-${index}`}
                                    className="flex justify-between py-2 border-b border-gray-100"
                                >
                                    <span className="text-sm text-gray-600 font-medium">
                                        {item.label}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        EGP {item.value}
                                    </span>
                                </div>
                            ))}
                            <Separator className="w-full h-px my-4 bg-gray-300" />
                            <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
                                <span className="font-bold text-lg text-gray-800">
                                    {t('balanceDue')}
                                </span>
                                <span className="font-bold text-lg text-gray-900">
                                    EGP {balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Computer generated notice */}
                    <div className="text-center mb-8">
                        <p className="text-sm text-gray-500 italic">
                            {t('computerGenerated')}
                        </p>
                    </div>

                    {/* Bank details section */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="mb-4">
                            <h3 className="text-base font-semibold text-gray-700 mb-2">
                                {t('bankDetails')}
                            </h3>
                            <Separator className="w-48 h-px bg-gray-300" />
                        </div>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{t('beneficiaryName')}</span> {bankDetails.beneficiaryName}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{t('bankName')}</span> {bankDetails.bankName}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{t('accountDetails')}</span> {bankDetails.accountDetails}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{t('accountCurrency')}</span> {bankDetails.currency}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
