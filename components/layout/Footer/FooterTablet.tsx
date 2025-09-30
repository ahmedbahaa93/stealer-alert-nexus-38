import ContactUs from './ContactUs';
import CourseCategories from './CourseCategories';
import Identity from './Identity';
import Newsletter from './Newsletter';
import QuickLinks from './QuickLinks';
import UnderFooter from './UnderFooter';

function FooterTablet() {
  return (
    <>
      <footer className="bg-primary-identity grid grid-cols-2 gap-8 p-8">
        <div className="flex flex-col gap-8">
          <Identity />
          <QuickLinks />
        </div>
        <div className="flex flex-col gap-8">
          <ContactUs />
          <CourseCategories />
          <Newsletter />
        </div>
      </footer>
      <div className="bg-primary-identity w-full border-t-2 p-2 text-center">
        <UnderFooter />
      </div>
    </>
  );
}

export default FooterTablet
