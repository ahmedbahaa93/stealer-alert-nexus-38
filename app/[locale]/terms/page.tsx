import NamePageSetter from '@/components/NamePageSetter';
import Terms from '@/components/Terms';

function Page() {
    return (
        <div className="lg:px-30 terms-section">
            <Terms />
            <NamePageSetter pageKey="terms" />
        </div>
    );
}

export default Page;
