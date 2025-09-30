import { Metadata } from 'next';
import Courses from '@/components/Courses';
import NamePageSetter from '@/components/NamePageSetter';

export const metadata: Metadata = {
    title: 'Courses',
    description: 'Explore our wide range of professional development courses to advance your career and enhance your skills.',
};

function Page() {
    return (
        <div className="px-9 course-section">
            <Courses />
            <NamePageSetter pageKey="course" />
        </div>
    );
}

export default Page;
