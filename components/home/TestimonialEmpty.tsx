import { FC } from 'react';
import { useTranslations } from 'next-intl';

const TestimonialEmpty: FC = () => {
    const t = useTranslations('Home.Testimonials');

    return (
        <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t('empty.title')}</h3>
            <p className="mt-1 text-gray-500">{t('empty.message')}</p>
        </div>
    );
};

export default TestimonialEmpty;
