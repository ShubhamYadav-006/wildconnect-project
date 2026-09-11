import HeroSection from "../../components/home/HeroSection";
import PlanningSteps from "../../components/home/PlanningSteps";
import FeaturedDestinations from "../../components/home/FeaturedDestinations";
import FeaturedResorts from "../../components/home/FeaturedResorts";
import WhyChooseSection from "../../components/home/WhyChooseSection";
import ExperiencesSection from "../../components/home/ExperiencesSection";
import ArticlesSection from "../../components/home/ArticlesSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import FAQSection from "../../components/home/FAQSection";
import CTASection from "../../components/home/CTASection";

const Home = () => {
  return (
    <div className="home-container">

      <HeroSection />

      <PlanningSteps />

      <FeaturedDestinations />

      <FeaturedResorts />

      <WhyChooseSection />

      <ExperiencesSection />

      <ArticlesSection />

      <TestimonialsSection />

      <FAQSection />

      <CTASection />

    </div>
  );
};

export default Home;