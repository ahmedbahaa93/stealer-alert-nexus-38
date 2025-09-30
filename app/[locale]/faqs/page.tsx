import Faqs from '@/components/Faqs';
import NamePageSetter from '@/components/NamePageSetter';

function Page() {
    return (
        <div className="common-bg md:px-30">
            <Faqs />
            <NamePageSetter pageKey="faqs" />
        </div>
    );
}

export default Page;
