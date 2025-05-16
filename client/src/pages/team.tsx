import { useEffect } from "react";
import TeamSection from "@/components/sections/team-section";
import CTASection from "@/components/sections/cta-section";

export default function Team() {
  useEffect(() => {
    document.title = "Our Team | Strategix AI";
  }, []);

  return (
    <div className="pt-20">
      <TeamSection />
      <CTASection />
    </div>
  );
}
