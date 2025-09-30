import { useTranslations } from 'next-intl';
import Heading from './Heading';
import { CheckCircle, Shield } from 'lucide-react';
import { MotionDiv } from '@/components/ui/motion';

function OurPromise() {
    const t = useTranslations('about-page.3rd-section');

    let promiseItems;
    try {
        promiseItems = t.raw('items');
    } catch (error) {
        console.warn('Failed to load promise items:', error);
        promiseItems = [];
    }

    return (
        <div className="mt-15">
            <MotionDiv
                className="flex items-center justify-center gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="p-2 bg-gradient-to-r from-blue-600 to-green-500 rounded-full">
                    <Shield className="text-white" size={50} />
                </div>
                <Heading data={t('title')} />
            </MotionDiv>
            <MotionDiv
                className="mt-12 px-5 md:px-10 lg:px-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-6 shadow-lg border border-blue-100">
                    <div className="space-y-4">
                        {promiseItems && Array.isArray(promiseItems) && promiseItems.map((item: string, index: number) => (
                            <MotionDiv
                                key={index}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                                viewport={{ once: true }}
                            >
                                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-600" />
                                <span className="text-lg">{item}</span>
                            </MotionDiv>
                        ))}
                    </div>

                    <MotionDiv
                        className="mt-8 border-t border-gray-200 pt-4 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-lg font-medium text-primary-identity">{t('conclusion')}</p>
                    </MotionDiv>
                </div>
            </MotionDiv>
        </div>
    );
}

export default OurPromise;
