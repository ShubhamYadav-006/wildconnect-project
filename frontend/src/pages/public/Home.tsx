/* ==========================================================
   Home Page Component
   ----------------------------------------------------------
   Purpose:
   Landing page for WildConnect, combining all featured
   sections with a cohesive luxury safari design aesthetic.
 ========================================================== */

import HeroSection from "../../components/home/HeroSection";
import PlanningSteps from "../../components/home/PlanningSteps";
import FeaturedDestinations from "../../components/home/FeaturedDestinations";
import FeaturedResorts from "../../components/home/FeaturedResorts";
import WhyChooseSection from "../../components/home/WhyChooseSection";
import ArticlesSection from "../../components/home/ArticlesSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import FAQSection from "../../components/home/FAQSection";
import CTASection from "../../components/home/CTASection";

import "../../styles/public/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <HeroSection />
      <FeaturedDestinations />
      <PlanningSteps />
      <FeaturedResorts />
      <WhyChooseSection />
      <ArticlesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default Home;