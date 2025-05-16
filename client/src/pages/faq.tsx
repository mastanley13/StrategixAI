import { useEffect } from "react";
import FAQSection from "@/components/sections/faq-section";
import CTASection from "@/components/sections/cta-section";

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ | Strategix AI";
  }, []);

  return (
    <div className="pt-20">
      <FAQSection />
      <CTASection />
    </div>
  );
}
