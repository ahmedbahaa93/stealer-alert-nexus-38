import SuccessPartners from './home/SuccessPartners';
import Articles from './home/Articles';
import TrainingVendors from './home/TrainingVendors';
import CourseDiscount from './home/CourseDiscount';
import HeroSection from './home/HeroSection';
import OurCourses from './home/OurCourses';
import RequestCallBack from './home/RequestCallBack';
import SuccessMetrics from './home/SuccessMetrics';
import NewTestimonial from './home/NewTestimonial';
import TopCategory from './home/TopCategory';
import SectionAnimation from './ui/SectionAnimation';

function Home() {
  return (
    <main className="home-page smooth-scroll overflow-fix">
      <SectionAnimation>
        <HeroSection />
      </SectionAnimation>

      <SectionAnimation delay={0.1} className="section-container card-hover-section overflow-fix">
        <CourseDiscount />
      </SectionAnimation>

      <SectionAnimation delay={0.2} className="section-container overflow-fix">
        <SuccessPartners />
      </SectionAnimation>

      <SectionAnimation delay={0.1} className="section-container card-hover-section overflow-fix">
        <OurCourses />
      </SectionAnimation>

      <SectionAnimation delay={0.2} className="section-container overflow-fix">
        <SuccessMetrics />
      </SectionAnimation>

      <SectionAnimation delay={0.1} className="section-container overflow-fix">
        <TopCategory />
      </SectionAnimation>

      <SectionAnimation delay={0.1} className="section-container card-hover-section overflow-fix">
        <NewTestimonial />
      </SectionAnimation>

      <SectionAnimation delay={0.2} className="section-container card-hover-section overflow-fix">
        <TrainingVendors />
      </SectionAnimation>

      <SectionAnimation delay={0.2} className="section-container card-hover-section overflow-fix">
        <Articles />
      </SectionAnimation>

      <SectionAnimation delay={0.1} className="section-container">
        <RequestCallBack />
      </SectionAnimation>
    </main>
  );
}

export default Home;
