import HeroSection from '../features/home/HeroSection';
import FeaturesOverviewSection from '../features/home/FeaturesOverviewSection'; // Import the new section
// Remove BenefitsSection and ExploreFeaturesSection imports

const HomePage = () => {
  return (
    <>
      <HeroSection />
      {/* Apply spotlight effect to this instance */}
      <FeaturesOverviewSection applySpotlightEffect={true} />
    </>
  );
};

export default HomePage;