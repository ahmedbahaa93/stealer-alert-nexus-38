import { Metadata } from 'next';
import Home from '@/components/Home';
import NamePageSetter from '@/components/NamePageSetter';

export const metadata: Metadata = {
    title: 'Home',
    description: 'RaiseUp - Your platform for professional development and career growth. Explore courses, training programs, and resources to enhance your skills.',
};

export default function HomePage() {
    return (
        <div>
            <Home />
            <NamePageSetter pageKey="" />
        </div>
    );
}
