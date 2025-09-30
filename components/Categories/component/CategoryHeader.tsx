"use client";

import Image from "../../../Ui/Image";
// import { useTranslations } from 'next-intl';

interface CategoryHeaderProps {
    title: string;
    subtitle: string;
    category: string;
}

const CategoryHeader = ({ title, subtitle, category }: CategoryHeaderProps) => {
    // const t = useTranslations('Categories');

    return (
        <div className="text-center mb-12 p-5 bg-gray-100 ">

            {/* Book icon */}
            <div className="flex justify-center mb-4 items-center gap-4">
                <Image
                    imageurl={'/assets/Categoires-Page/open-book-icon 1.png'}
                    alt="Book Icon"
                />
                <h1 className="text-3xl font-bold text-[#0F43B4] mb-2">{title}</h1>
            </div>

            <p className="text-[#0F43B4] text-lg mb-8">{subtitle}</p>
            <h2 className="text-2xl font-bold text-[#0F43B4]">{category}</h2>
        </div>
    );
};

export default CategoryHeader;
