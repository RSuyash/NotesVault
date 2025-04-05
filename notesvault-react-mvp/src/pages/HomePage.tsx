import HeroSection from '../features/home/HeroSection.js';
import FeaturesOverviewSection from '../features/home/FeaturesOverviewSection.js'; // Import the new section
import TestimonialSection from '../features/home/TestimonialSection.js'; // Import Testimonials
import FinalCTASection from '../features/home/FinalCTASection.js'; // Import Final CTA
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