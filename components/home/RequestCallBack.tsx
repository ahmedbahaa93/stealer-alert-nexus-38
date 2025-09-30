"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Border from "@/components/auth/Border";
import { toast } from "sonner";
import Image from "next/image";
import { RequestCallbackAPI, RequestCallbackRequest } from "@/lib/api/requestCallback";

// Form validation schema
const createRequestCallbackSchema = (t: any) =>
    z.object({
        fullName: z
            .string()
            .min(1, t("RequestCallBack.validation.fullNameRequired"))
            .min(2, "Name must be at least 2 characters"),
        email: z
            .string()
            .min(1, t("RequestCallBack.validation.emailRequired"))
            .email(t("RequestCallBack.validation.emailInvalid")),
        phone: z
            .string()
            .min(1, t("RequestCallBack.validation.phoneRequired"))
            .regex(/^[0-9+\-\s()]+$/, t("RequestCallBack.validation.phoneInvalid")),
        department: z
            .string()
            .min(1, t("RequestCallBack.validation.departmentRequired")),
    });

type RequestCallbackFormData = z.infer<ReturnType<typeof createRequestCallbackSchema>>;

export default function RequestCallBack() {
    const t = useTranslations();
    const locale = useLocale();
    const isRTL = locale === "ar";

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form setup
    const form = useForm<RequestCallbackFormData>({
        resolver: zodResolver(createRequestCallbackSchema(t)),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            department: "",
        },
    });

    // Handle form submission
    const onSubmit = async (data: RequestCallbackFormData) => {
        setIsLoading(true);

        try {
            const requestData: RequestCallbackRequest = {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                department: data.department,
            };

            await RequestCallbackAPI.submitRequest(requestData);

            // Show success message
            setShowSuccess(true);
            toast.success(t("RequestCallBack.success.message"));

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => setShowSuccess(false), 5000);

        } catch (error) {
            let errorMessage = t("RequestCallBack.error.general.message");
            let errorTitle = t("RequestCallBack.error.general.title");

            if (error instanceof Error) {
                if (error.message === "NETWORK_ERROR") {
                    errorMessage = t("RequestCallBack.error.network.message");
                    errorTitle = t("RequestCallBack.error.network.title");
                }
            }

            toast.error(errorTitle, {
                description: errorMessage,
                action: {
                    label: t("RequestCallBack.error.general.retry"),
                    onClick: () => onSubmit(data),
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const departments = [
        { value: "hr", label: t("RequestCallBack.form.department.options.hr") },
        { value: "management", label: t("RequestCallBack.form.department.options.management") },
        { value: "it", label: t("RequestCallBack.form.department.options.it") },
        { value: "marketing", label: t("RequestCallBack.form.department.options.marketing") },
        { value: "sales", label: t("RequestCallBack.form.department.options.sales") },
        { value: "finance", label: t("RequestCallBack.form.department.options.finance") },
    ];

    return (
        <section className={`w-full min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12 xl:py-16 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="flex flex-col items-center gap-3 lg:gap-4 xl:gap-5 mb-8 lg:mb-10 xl:mb-12 max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <Image
                            src="/assets/RequestCallBack/title-icon.svg"
                            alt="Request Callback Icon"
                            width={60}
                            height={62}
                            className="w-[40px] h-[42px] lg:w-[50px] lg:h-[52px] xl:w-[60px] xl:h-[62px]"
                        />
                        <h2 className="font-inter text-[#0f43b4] text-[24px] lg:text-[28px] xl:text-[32px] font-normal leading-normal">
                            {t("RequestCallBack.title")}
                        </h2>
                    </div>

                    <p className="w-full font-inter text-[#333333] text-[16px] lg:text-[18px] xl:text-[20px] font-normal leading-normal text-center px-4">
                        {t("RequestCallBack.description")}
                    </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="max-w-4xl mx-auto mb-6 lg:mb-8 p-4 lg:p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-center">
                            <h3 className="text-green-800 text-lg lg:text-xl font-semibold mb-2">
                                {t("RequestCallBack.success.title")}
                            </h3>
                            <p className="text-green-700 text-sm lg:text-base">
                                {t("RequestCallBack.success.message")}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Content Container */}
                <div className="flex flex-col xl:flex-row justify-center gap-8 xl:gap-[109px] mx-auto">
                    {/* Form Section */}
                    <div className="w-full xl:flex-1">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
                                {/* Row 1 - Department and Full Name */}
                                <div className={`flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                                    {/* Department Select */}
                                    <FormField
                                        control={form.control}
                                        name="department"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-[10px] w-full ">
                                                <Label className="text-lg lg:text-[20px] xl:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]">
                                                    {t("RequestCallBack.form.department.label")}
                                                </Label>
                                                <FormControl>
                                                    <Border>
                                                        <div className={`w-full h-[60px] lg:h-[70px] xl:h-[78px] bg-[#fbfbfb] rounded-[10px] flex items-center px-4 lg:px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}>
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                            >
                                                                <SelectTrigger className="w-full border-none shadow-none focus:ring-0 bg-transparent">
                                                                    <SelectValue
                                                                        placeholder={t("RequestCallBack.form.department.placeholder")}
                                                                        className="font-inter text-[#0f43b4] text-[16px] lg:text-[20px] xl:text-[24px] font-normal"
                                                                    />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {departments.map((dept) => (
                                                                        <SelectItem key={dept.value} value={dept.value}>
                                                                            {dept.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </Border>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Full Name Input */}
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-[10px] w-full ">
                                                <Label className="text-lg lg:text-[20px] xl:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]">
                                                    {t("RequestCallBack.form.fullName.label")}
                                                    <span className="text-[#bb0064] ml-1">
                                                        {t("RequestCallBack.form.fullName.required")}
                                                    </span>
                                                </Label>
                                                <FormControl>
                                                    <Border>
                                                        <Input
                                                            {...field}
                                                            className={`w-full h-[60px] lg:h-[70px] xl:h-[78px] border-none bg-white rounded-[10px] ${isRTL ? 'text-right border-l-4 border-l-[#0f43b4]' : 'text-left border-r-4 border-r-[#0f43b4]'} text-[14px] lg:text-[16px] xl:text-[18px] font-light text-[#333] font-inter py-[15px] lg:py-[18px] xl:py-[20px] px-[18px] lg:px-[20px] xl:px-[22px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}
                                                            placeholder={t("RequestCallBack.form.fullName.placeholder")}
                                                            disabled={isLoading}
                                                        />
                                                    </Border>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Row 2 - Phone and Email */}
                                <div className={`flex flex-col lg:flex-row items-center gap-4 lg:gap-6 w-full ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                                    {/* Phone Input */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-[10px] w-full ">
                                                <Label className="text-lg lg:text-[20px] xl:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]">
                                                    {t("RequestCallBack.form.phone.label")}
                                                    <span className="text-[#bb0064] ml-1">
                                                        {t("RequestCallBack.form.phone.required")}
                                                    </span>
                                                </Label>
                                                <FormControl>
                                                    <Border>
                                                        <Input
                                                            {...field}
                                                            type="tel"
                                                            className={`w-full h-[60px] lg:h-[70px] xl:h-[78px] border-none bg-white rounded-[10px] ${isRTL ? 'text-right border-r-4 border-r-[#0f43b4]' : 'text-left border-l-4 border-l-[#0f43b4]'} text-[14px] lg:text-[16px] xl:text-[18px] font-light text-[#333] font-inter py-[15px] lg:py-[18px] xl:py-[20px] px-[18px] lg:px-[20px] xl:px-[22px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}
                                                            placeholder={t("RequestCallBack.form.phone.placeholder")}
                                                            disabled={isLoading}
                                                        />
                                                    </Border>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email Input */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-[10px] w-full ">
                                                <Label className="text-lg lg:text-[20px] xl:text-[24px] font-normal text-[#0f43b4] font-inter leading-[29px]">
                                                    {t("RequestCallBack.form.email.label")}
                                                    <span className="text-[#bb0064] ml-1">
                                                        {t("RequestCallBack.form.email.required")}
                                                    </span>
                                                </Label>
                                                <FormControl>
                                                    <Border>
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            className={`w-full h-[60px] lg:h-[70px] xl:h-[78px] border-none bg-white rounded-[10px] ${isRTL ? 'text-right border-l-4 border-l-[#0f43b4]' : 'text-left border-r-4 border-r-[#0f43b4]'} text-[14px] lg:text-[16px] xl:text-[18px] font-light text-[#333] font-inter py-[15px] lg:py-[18px] xl:py-[20px] px-[18px] lg:px-[20px] xl:px-[22px] focus:outline-none focus:ring-0 placeholder:text-[#b3b3b3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}
                                                            placeholder={t("RequestCallBack.form.email.placeholder")}
                                                            disabled={isLoading}
                                                        />
                                                    </Border>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4 lg:pt-6 xl:pt-8">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-[180px] lg:w-[200px] xl:w-[222px] h-[50px] lg:h-[55px] xl:h-[60px] bg-[#0f43b4] rounded-[15px] hover:bg-[#0d3a9e] border-none shadow-lg text-white text-[18px] lg:text-[20px] xl:text-[24px] font-normal font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading
                                            ? t("RequestCallBack.form.submitting")
                                            : t("RequestCallBack.form.submit")
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    {/* Image Section */}
                    <div className="relative w-full max-w-[300px] md:max-w-[350px] lg:max-w-[380px] xl:max-w-[425px] h-[280px] md:h-[320px] lg:h-[380px] xl:h-[422px] flex-shrink-0 mt-8 xl:mt-0 mx-auto">
                        {/* Top left decoration */}
                        <div className="absolute w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] h-[120px] md:h-[140px] lg:h-[160px] xl:h-[171px] top-0 left-0">
                            <Image
                                src="/assets/RequestCallBack/top-left-shape.svg"
                                alt="Top left decoration"
                                width={200}
                                height={171}
                                className="w-full h-full"
                            />
                        </div>

                        {/* Bottom right decoration */}
                        <div className="absolute w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] h-[120px] md:h-[140px] lg:h-[160px] xl:h-[171px] bottom-0 right-0">
                            <Image
                                src="/assets/RequestCallBack/bottom-right-shape.svg"
                                alt="Bottom right decoration"
                                width={200}
                                height={171}
                                className="w-full h-full"
                            />
                        </div>

                        {/* Main central image */}
                        <div className="absolute flex items-center justify-center w-[280px] md:w-[320px] lg:w-[360px] xl:w-[400px] h-[280px] md:h-[320px] lg:h-[360px] xl:h-[400px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Image
                                src="/assets/RequestCallBack/section-image.jpg"
                                alt="Request callback illustration"
                                width={400}
                                height={400}
                                className="w-full h-full object-cover rounded-[15px] lg:rounded-[20px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
