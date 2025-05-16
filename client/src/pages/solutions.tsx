import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/sections/cta-section";

export default function Solutions() {
  useEffect(() => {
    document.title = "Solutions | Strategix AI";
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const solutionCategories = [
    {
      id: "consulting",
      title: "Deep-Dive AI Consulting",
      description: "Fixed-fee, fixed-scope discovery that surfaces high-ROI automation targets, ranks them, and delivers a 90-day action plan with timelines, budgets, and KPIs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-400",
      ctaText: "Book a Consultation"
    },
    {
      id: "training",
      title: "Custom Training",
      description: "Tailored curricula (live + recorded) that cut time-to-self-sufficiency by 40% on average.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "from-purple-500 to-violet-400",
      ctaText: "Request Training Info"
    }
  ];

  const products = [
    {
      name: "Dog-Care Suite",
      status: "Launching Q3 2025",
      statusColor: "yellow",
      description: "Booking, vaccination tracking, billing, staff scheduling, daily pet reports - one login for everything.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 16v-1m6.364 1.636l.707.707M12 3v1M3 12h1m16-8l-.707.707M17.5 6.5l.5.5M6.5 17.5l.5.5M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6 12a6 6 0 0 1 7-5.916" />
          <path d="M17 7a2 2 0 0 0-2-2" />
          <path d="M15 12a6 6 0 0 1-6 6" />
          <path d="M5 15a2 2 0 0 0 2 2" />
        </svg>
      ),
      color: "from-amber-400 to-orange-500"
    },
    {
      name: "Sales Trainer",
      status: "Enterprise pilots",
      statusColor: "blue",
      description: "AI avatars simulate prospects, coach in real time, and grade calls automatically.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      ),
      color: "from-blue-400 to-indigo-500"
    },
    {
      name: "AI-Ready Websites",
      status: "Live",
      statusColor: "green",
      description: "Conversion-optimised sites wired to workflows from day 1 (starting $1k).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      ),
      color: "from-emerald-400 to-green-500"
    },
    {
      name: "Voice-AI Integrations",
      status: "Live",
      statusColor: "green",
      description: "24/7 phone assistants that transact, upsell, and sync to CRM.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 18.5A3.5 3.5 0 0 1 8.5 15H8v-2h8v2h-.5a3.5 3.5 0 0 1-3.5 3.5Z" />
          <path d="M12 13.5a1.5 1.5 0 0 1-1.5-1.5v-1a5.5 5.5 0 0 1 11 0v1a1.5 1.5 0 0 1-1.5 1.5h-8Z" />
          <path d="M7 10v1a5 5 0 0 0 10 0v-1" />
          <line x1="22" x2="2" y1="21" y2="21" />
        </svg>
      ),
      color: "from-cyan-400 to-blue-500"
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-t from-purple-600/20 to-transparent blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
              <span className="text-sm font-medium">AI-Powered Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
              Tailored <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">AI Solutions</span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Designed to address your specific business challenges with innovative technology and practical implementation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-800 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center">
              High-Touch Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-400 mx-auto mt-4 mb-6"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {solutionCategories.map((category, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="relative"
              >
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-b opacity-10 blur-3xl -z-10"></div>
                  
                  <div className="p-8 md:p-10 md:flex items-start gap-8">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${category.color} flex-shrink-0 mb-6 md:mb-0`}>
                      {category.icon}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-display font-bold text-white mb-4">
                        {category.title}
                      </h3>
                      <p className="text-lg text-gray-300 mb-8">
                        {category.description}
                      </p>
                      
                      <Button 
                        className={`bg-gradient-to-r ${category.color} hover:opacity-90 transition-opacity`}
                      >
                        {category.ctaText}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Decorative gradient bar at bottom */}
                  <div className={`h-1 w-full bg-gradient-to-r ${category.color}`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white text-center">
              Flagship Products
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-400 mx-auto mt-4 mb-6"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {products.map((product, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${product.color}`}>
                      {product.icon}
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full ${
                      product.statusColor === "green" 
                        ? "bg-green-900/30 text-green-400 border border-green-700/50" 
                        : product.statusColor === "yellow"
                          ? "bg-amber-900/30 text-amber-400 border border-amber-700/50"
                          : "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                    }`}>
                      <span className="text-sm font-medium">{product.status}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-gray-300 mb-6">{product.description}</p>
                  
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Let&apos;s Talk
                  </Button>
                </div>
                
                {/* Decorative gradient bar at bottom */}
                <div className={`h-1 w-full bg-gradient-to-r ${product.color}`}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}