import { useEffect } from "react";
import ProcessSection from "@/components/sections/process-section";
import CTASection from "@/components/sections/cta-section";

export default function Process() {
  useEffect(() => {
    document.title = "Our Process | Strategix AI";
  }, []);

  return (
    <div className="pt-20">
      <ProcessSection />
      <CTASection />
    </div>
  );
}
