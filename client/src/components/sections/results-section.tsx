import { Button } from "@/components/ui/button";

export default function ResultsSection() {
  const caseStudies = [
    {
      title: "River Bend Golf & Country Club",
      imageSrc: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "River Bend Golf & Country Club",
      problem: "$46k monthly deficit.",
      solution: "Conversational assistant, automated marketing, task automation, staff training.",
      outcome: "$92k profit in six months."
    },
    {
      title: "Independent Mortgage Broker",
      imageSrc: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      imageAlt: "Independent Mortgage Broker",
      problem: "Manual outreach bottleneck.",
      solution: "AI task dashboard + automated engagement flows.",
      outcome: "200% revenue growth and 70% efficiency gain."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Case Study Highlights</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {caseStudies.map((study, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
                <img 
                  src={study.imageSrc}
                  alt={study.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-display font-bold text-white">{study.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Problem</h4>
                  <p className="text-gray-600">{study.problem}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-primary">Solution</h4>
                  <p className="text-gray-600">{study.solution}</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-green-600">Outcome</h4>
                  <p className="text-gray-600">{study.outcome}</p>
                </div>
                <div className="mt-6">
                  <Button variant="link" className="text-primary p-0 flex items-center">
                    View Full Case Study
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
