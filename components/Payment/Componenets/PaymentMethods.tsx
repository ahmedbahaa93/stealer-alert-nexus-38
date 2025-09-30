import { CreditCard } from "lucide-react";
import { useTranslations } from 'next-intl';

interface PaymentMethodsProps {
    selectedMethod: string;
    // eslint-disable-next-line no-unused-vars
    onMethodChange: (value: string) => void;
}

const PaymentMethods = ({ selectedMethod, onMethodChange }: PaymentMethodsProps) => {
    const t = useTranslations('Payment');

    const methods = [
        {
            id: "credit-card",
            name: t('creditCard'),
            icon: <CreditCard className="w-5 h-5" />,
        },
        {
            id: "instapay",
            name: t('instapay'),
            icon: (
                <div className="w-5 h-5 bg-[#0F43B4] rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
            ),
        },
    ];

    return (
        <div className="flex gap-4 mb-8 justify-center">
            {methods.map((method) => (
                <button
                    key={method.id}
                    onClick={() => onMethodChange(method.id)}
                    className={`flex items-center gap-3 px-7 py-3 rounded-xl border-2 transition-all duration-200 min-w-[160px] justify-center font-medium text-base ${selectedMethod === method.id
                        ? "border-[#0F43B4] bg-[#0F43B4] text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md"
                        }`}
                >

                    <span>{method.name}</span>
                </button>
            ))}
        </div>
    );
};

export default PaymentMethods;