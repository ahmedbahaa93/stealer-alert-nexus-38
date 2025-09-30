import { Metadata } from 'next';
import ContactUs from "@/components/ContactUs"
import NamePageSetter from "@/components/NamePageSetter"

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with our team for inquiries, support, or collaboration opportunities.',
};

function Page() {
    return (
        <div className="common-bg">
            <ContactUs />
            <NamePageSetter pageKey="contact" />
        </div>
    )
}

export default Page
