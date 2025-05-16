import { useEffect } from "react";
import ResultsSection from "@/components/sections/results-section";
import CTASection from "@/components/sections/cta-section";

export default function Results() {
  useEffect(() => {
    document.title = "Results | Strategix AI";
  }, []);

  return (
    <div className="pt-20">
      <ResultsSection />
      <CTASection />
    </div>
  );
}
