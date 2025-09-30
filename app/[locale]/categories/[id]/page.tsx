'use client';

import { useParams } from 'next/navigation';
import { CategoriesProvider } from '@/context/CategoriesContext';
import Categories from '@/components/Categories/Categories';

export default function CategoryPage() {
    const params = useParams();
    const categoryId = params?.id as string;

    return (
        <CategoriesProvider initialCategoryId={categoryId}>
            <Categories />
        </CategoriesProvider>
    );
}
