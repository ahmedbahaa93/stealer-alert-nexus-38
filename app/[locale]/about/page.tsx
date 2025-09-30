import { Metadata } from 'next';
import About from '@/components/About';
import NamePageSetter from '@/components/NamePageSetter';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about RaiseUp\'s mission, vision, and the team behind our professional development platform.',
};

function Page() {
    return (
        <div className="about-section px-5 md:px-15">
            <About />
            <NamePageSetter pageKey="about" />
        </div>
    );
}

export default Page;
