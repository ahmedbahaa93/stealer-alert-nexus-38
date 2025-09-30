'use client';

import { useState } from "react";
import { useTranslations } from 'next-intl';
import CreditCardForm from "./Componenets/CreditCardForm";
import CourseDetails from "./Componenets/CourseDetails";
import ProgressSteps from "./Componenets/ProgressSteps";
import PaymentMethods from "./Componenets/PaymentMethods";
import Image from "../../Ui/Image";

interface PaymentFormProps {
    courseId: string;
}

const PaymentForm = ({ courseId }: PaymentFormProps) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card");
    const t = useTranslations('Payment');

    return (
        <div className="min-h-screen bg-gradient-to-br relative from-blue-50 to-green-50 py-8 px-4 mt-28">
            {/* Background Decorative Images */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top-right corner image */}
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
                    <Image
                        className="w-15 h-15 lg:w-25 lg:h-25 opacity-60"
                        imageurl="/assets/Payment-Page/card-tick.svg"
                        alt="decorative circle"
                    />
                </div>

                {/* Bottom-right corner image */}
                <div className="absolute bottom-4 right-4 lg:bottom-12 lg:right-20">
                    <Image
                        className="w-15 h-15 lg:w-25 lg:h-25 opacity-60"
                        imageurl="/assets/Payment-Page/Clip path group.svg"
                        alt="decorative circle"
                    />
                </div>

                {/* Center decorative image */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                    <Image
                        className="w-15 h-15 lg:w-25 lg:h-25 opacity-20"
                        imageurl="/assets/Payment-Page/card-pos.svg"
                        alt="center decorative"
                    />
                </div>
            </div>

            <div className="">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0F43B4] mb-8">{t('payment')}</h1>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row justify-around items-center w-full" dir="auto">
                    {/* Payment Form - Left Side */}
                    <div className="w-full space-y-8 lg:w-[40%]">
                        <ProgressSteps currentStep={2} />

                        <div className="p-6 lg:p-8 flex flex-col gap-4">
                            <PaymentMethods
                                selectedMethod={selectedPaymentMethod}
                                onMethodChange={setSelectedPaymentMethod}
                            />
                            {selectedPaymentMethod === "credit-card" && (
                                <div className="mt-8">
                                    <CreditCardForm courseId={courseId} />
                                </div>
                            )}
                            {selectedPaymentMethod === "instapay" && (
                                <div className="mt-8 p-8 text-center text-gray-500">
                                    <p>{t('instapayIntegration')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Details - Right Side */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-[#0F43B4] mb-6 text-center lg:text-start">{t('courseDetails')}</h3>
                        <CourseDetails courseId={courseId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
