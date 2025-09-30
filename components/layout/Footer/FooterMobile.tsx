import ContactUs from './ContactUs';
import CourseCategories from './CourseCategories';
import Identity from './Identity';
import Newsletter from './Newsletter';
import QuickLinks from './QuickLinks';
import UnderFooter from './UnderFooter';

function FooterMobile() {
  return (
    <>
      <footer className="bg-primary-identity flex flex-col items-center text-center gap-8 p-8">
        <Identity />
        <QuickLinks />
        <ContactUs />
        <CourseCategories />
        <Newsletter />
      </footer>
      <div className="bg-primary-identity w-full border-t-2 p-2 text-center">
        <UnderFooter />
      </div>
    </>
  );
}

export default FooterMobile
