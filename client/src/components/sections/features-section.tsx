import TestimonialCarousel from "@/components/ui/testimonial-carousel";

export default function FeaturesSection() {
  const features = [
    {
      challenge: "AI \"audits\" that deliver a slide deck and no follow-through.",
      edge: "We hand you a costed 90-day Action Plan plus a prototype backlog you can start tomorrow."
    },
    {
      challenge: "Pet-care tools solve bookings but ignore day-to-day operations.",
      edge: "Our Dog-Care Ops Suite unifies staff tasks, client portal, voice bots, and CRM automation in one build."
    },
    {
      challenge: "Call-analytics platforms analyse calls only after they're over.",
      edge: "Sales Trainer coaches reps during the call and auto-grades instantly."
    },
    {
      challenge: "Generic voice bots stop at answering the phone.",
      edge: "We link voice, CRM, and marketing workflows so every interaction fuels the next sale."
    }
  ];

  const testimonials = [
    {
      quote: "Strategix AI not only understood our business challenges, they delivered automation that actually works. We've reclaimed 20+ hours per week.",
      author: "Sarah Johnson",
      role: "CEO, River Bend Golf & Country Club",
      image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      quote: "The AI automation dashboard Strategix built doubled our revenue while cutting our workload by 70%. The ROI was immediate and game-changing.",
      author: "Michael Rodriguez",
      role: "Independent Mortgage Broker",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    },
    {
      quote: "The 5-day deep dive was worth every penny. Strategix AI mapped our entire workflow, found bottlenecks we didn't know existed, and delivered an action plan we could execute immediately.",
      author: "Jennifer Chen",
      role: "COO, TechVenture Solutions",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Why Strategix AI</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Challenge</h3>
                  <p className="text-gray-600">{feature.challenge}</p>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <h3 className="text-xl font-bold text-primary mb-2">Our Edge</h3>
                  <p className="text-gray-600">{feature.edge}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
