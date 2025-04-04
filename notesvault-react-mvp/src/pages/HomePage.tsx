import HeroSection from '../features/home/HeroSection';
import FeaturesOverviewSection from '../features/home/FeaturesOverviewSection'; // Import the new section
import TestimonialSection from '../features/home/TestimonialSection'; // Import Testimonials
import FinalCTASection from '../features/home/FinalCTASection'; // Import Final CTA
const HomePage = () => {
  return (
    <>
      <HeroSection />
      {/* Apply spotlight effect to this instance */}
      <FeaturesOverviewSection applySpotlightEffect={true} />
      <TestimonialSection />
      <FinalCTASection />
    </>
  );
};

export default HomePage;