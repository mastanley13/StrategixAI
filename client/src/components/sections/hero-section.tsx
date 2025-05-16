import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { setupHeroAnimation } from "@/lib/three-animations";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = setupHeroAnimation(canvasRef.current);
      // Mark as loaded after a short delay to ensure animations are ready
      const timer = setTimeout(() => setIsHeroLoaded(true), 300);
      return () => {
        cleanup();
        clearTimeout(timer);
      };
    }
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  return (
    <section id="home" className="pt-20 md:pt-24 pb-20 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/50 z-10"></div>
      
      {/* 3D Animation Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div 
          className="grid lg:grid-cols-5 gap-12 items-center"
          initial="hidden"
          animate={isHeroLoaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Text Content - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
                <span className="text-sm font-medium">AI-Powered Solutions</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-white"
              variants={itemVariants}
            >
              Turn Bottlenecks into <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
                Breakthroughs
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl"
              variants={itemVariants}
            >
              Strategix AI uncovers your biggest process pain points, designs the right automation, and delivers working solutions—so you grow revenue and win back time without the trial‑and‑error.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link href="#book-call">
                <Button 
                  size="lg" 
                  className="relative group bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-blue-500 group-hover:scale-[2.5] transition-transform duration-500 transform origin-left"></span>
                  <span className="relative flex items-center">
                    Book a 30-minute Discovery Call
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                Download AI Action-Plan
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center"
              variants={itemVariants}
            >
              <span className="text-white/80 text-sm mr-4">
                Join our newsletter:
              </span>
              <div className="flex items-center space-x-3">
                {["Forbes", "TechCrunch", "Inc."].map((publication, index) => (
                  <div 
                    key={index} 
                    className="w-2 h-2 bg-white/30 rounded-full"
                  />
                ))}
                <span className="text-white/80 text-sm ml-1">Trusted by industry leaders</span>
              </div>
            </motion.div>
          </div>
          
          {/* Visual Element - Takes 2 columns on large screens */}
          <motion.div 
            className="lg:col-span-2 relative"
            variants={itemVariants}
          >
            <div className="relative rounded-xl overflow-hidden">
              {/* AI Visualization */}
              <div className="relative z-10 bg-black/30 backdrop-blur-sm p-7 rounded-xl border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {/* Metrics Cards */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <span className="text-xs text-cyan-300">+82%</span>
                    </div>
                    <h4 className="text-white font-medium">Revenue Growth</h4>
                    <p className="text-xs text-white/60">After automation</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-orange-300">-70%</span>
                    </div>
                    <h4 className="text-white font-medium">Time Savings</h4>
                    <p className="text-xs text-white/60">Hours reclaimed</p>
                  </div>
                  
                  <div className="col-span-2 bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-white text-xs font-medium">AI Action Plan</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-cyan-300 h-2 rounded-full w-[85%]"></div>
                      </div>
                      <span className="text-white text-xs ml-2">85%</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">Implementation progress</p>
                  </div>
                </div>
                
                {/* 90-Day Plan Badge */}
                <div className="absolute -bottom-5 -right-5 bg-gradient-to-br from-primary to-blue-600 p-3 rounded-lg shadow-lg transform rotate-3">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p className="font-bold text-white text-sm">90-Day AI Plan</p>
                      <p className="text-xs text-white/80">Ready in 1 week</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-1/4 -left-4 w-8 h-8 bg-primary rounded-lg opacity-50 animate-pulse"></div>
              <div className="absolute bottom-1/3 -right-5 w-10 h-10 bg-accent rounded-full opacity-30 animate-ping animation-delay-1000"></div>
              <div className="absolute -bottom-3 left-1/4 w-6 h-6 bg-white/10 rounded-md backdrop-blur-md border border-white/20 z-20"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Bottom Wave - Only visible on larger screens */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </section>
  );
}
