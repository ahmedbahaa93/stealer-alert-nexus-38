import { useTranslations } from 'next-intl';

interface ProgressStepsProps {
    currentStep: number;
}

const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
    const t = useTranslations('Payment');

    const steps = [
        { id: 1, name: t('course'), completed: currentStep > 1 },
        { id: 2, name: t('courseBooking'), completed: currentStep > 2 },
        { id: 3, name: t('payment'), completed: false },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center flex-1">
                        {/* Progress Bar */}
                        <div className="w-full mb-3">
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${step.completed || currentStep === step.id
                                    ? "bg-[#0F43B4]"
                                    : "bg-gray-300"
                                    }`}
                            />
                        </div>
                        {/* Step Label */}
                        <span
                            className={`text-sm font-medium text-center transition-colors duration-300 ${step.completed || currentStep === step.id
                                ? "text-[#0F43B4]"
                                : "text-gray-500"
                                }`}
                        >
                            {step.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressSteps;