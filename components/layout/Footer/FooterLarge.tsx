import ContactUs from './ContactUs';
import CourseCategories from './CourseCategories';
import Identity from './Identity';
import Newsletter from './Newsletter';
import QuickLinks from './QuickLinks';
import UnderFooter from './UnderFooter';

function FooterLarge() {

  return (
    <>
      <footer className="bg-primary-identity grid grid-cols-5 grid-rows-1 gap-4">
        <Identity />
        <QuickLinks />
        <ContactUs />
        <CourseCategories />
        <Newsletter />
      </footer>
      <div className="bg-primary-identity w-full border-t-2 p-2">
        <UnderFooter />
      </div>
    </>
  );
}

export default FooterLarge;

