import { motion } from "framer-motion";
import TestimonialCarousel from "@/components/ui/testimonial-carousel";

export default function FeaturesSection() {
  const features = [
    {
      challenge: "AI \"audits\" that deliver a slide deck and no follow-through.",
      edge: "We hand you a costed 90-day Action Plan plus a prototype backlog you can start tomorrow.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v13H3V8"/>
          <path d="M1 3h22v5H1z"/>
          <path d="M10 12h4"/>
          <path d="M10 16h4"/>
        </svg>
      ),
      color: "from-blue-500 to-cyan-400"
    },
    {
      challenge: "Pet-care tools solve bookings but ignore day-to-day operations.",
      edge: "Our Dog-Care Ops Suite unifies staff tasks, client portal, voice bots, and CRM automation in one build.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
      ),
      color: "from-purple-500 to-violet-400"
    },
    {
      challenge: "Call-analytics platforms analyse calls only after they're over.",
      edge: "Sales Trainer coaches reps during the call and auto-grades instantly.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      ),
      color: "from-red-500 to-orange-400"
    },
    {
      challenge: "Generic voice bots stop at answering the phone.",
      edge: "We link voice, CRM, and marketing workflows so every interaction fuels the next sale.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      color: "from-green-500 to-emerald-400"
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gray-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-t from-purple-600/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-600/10 to-transparent blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 }
            }
          }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
            <span className="text-sm font-medium">Our Competitive Edge</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
            Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Strategix AI</span>
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            We don't just analyze problems—we build and implement the solutions.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-b opacity-20 blur-3xl -z-10"></div>
              <div className="p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} w-16 h-16 flex items-center justify-center text-white mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">The Challenge</h3>
                    <p className="text-gray-300">{feature.challenge}</p>
                  </div>
                  <div className="border-t border-white/10 pt-6 mt-auto">
                    <h3 className="text-xl font-bold text-primary mb-2">Our Solution</h3>
                    <p className="text-gray-300">{feature.edge}</p>
                  </div>
                </div>
              </div>
              {/* Decorative gradient bar at bottom */}
              <div className={`h-1 w-full bg-gradient-to-r ${feature.color}`}></div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <TestimonialCarousel testimonials={testimonials} />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {[
            { value: "92%", label: "Efficiency Increase", suffix: "+", color: "text-blue-400" },
            { value: "2.5x", label: "Average ROI", suffix: "", color: "text-purple-400" },
            { value: "48", label: "Hours Saved Weekly", suffix: "+", color: "text-emerald-400" },
            { value: "30", label: "Enterprise Clients", suffix: "+", color: "text-orange-400" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <h3 className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                {stat.value}<span className="text-white">{stat.suffix}</span>
              </h3>
              <p className="text-gray-300 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
