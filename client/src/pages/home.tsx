import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import ProductsSection from "@/components/sections/products-section";
import CTASection from "@/components/sections/cta-section";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Strategix AI – AI Consulting, Automation & Training";
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <CTASection />
    </>
  );
}
