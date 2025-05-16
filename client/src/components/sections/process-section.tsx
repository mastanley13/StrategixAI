import ProcessTimeline from "@/components/ui/process-timeline";

export default function ProcessSection() {
  const processSteps = [
    {
      title: "1. Discovery Sprint",
      description: "Stakeholder interviews, process mapping, ROI scoring.",
      duration: "Duration: 1–5 days",
      imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Process mapping and discovery activities"
    },
    {
      title: "2. Blueprint Delivery",
      description: "90-day Action Plan with budget and KPI forecast.",
      duration: "Duration: 1 week",
      imageSrc: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "90-day action plan blueprint",
      reverse: true
    },
    {
      title: "3. Build & Integrate",
      description: "Iterative sprints; everything is guided, never thrown over the wall.",
      duration: "Duration: 4–8 weeks per workstream",
      imageSrc: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Development and integration process"
    },
    {
      title: "4. Custom Training",
      description: "Role-based enablement with certification quizzes.",
      duration: "Duration: 1–4 weeks",
      imageSrc: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Role-based training session",
      reverse: true
    },
    {
      title: "5. Ongoing Support",
      description: "Slack/Teams channel, 48-hour change-request SLA, quarterly ROI reviews.",
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "ROI reviews and ongoing support metrics"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="hero-gradient absolute inset-0"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Our Five-Phase Delivery Model</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
        </div>
        
        <ProcessTimeline steps={processSteps} />
      </div>
    </section>
  );
}
