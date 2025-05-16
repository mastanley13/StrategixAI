import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { setupHeroAnimation } from "@/lib/three-animations";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = setupHeroAnimation(canvasRef.current);
      return cleanup;
    }
  }, []);

  return (
    <section id="home" className="pt-28 pb-20 relative overflow-hidden">
      <div className="hero-gradient absolute inset-0"></div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-70"></canvas>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-gray-900">
              Turn Bottlenecks into <span className="text-primary">Breakthroughs</span> with Tailored AI Consulting
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Strategix AI uncovers your biggest process pain points, designs the right automation, and delivers working solutions—so you grow revenue and win back time without the trial‑and‑error.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              "Consult first, build second." Our deep‑dive workshops map a 90‑day AI action plan; then we engineer the workflows—voice, web, or back‑office—that keep your business running while you sleep.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="#book-call">
                <Button size="lg">Book a 30-minute Discovery Call</Button>
              </Link>
              <Button size="lg" variant="outline">
                Download the AI Action-Plan Sample
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="link" className="text-primary p-0 h-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Join the Newsletter
              </Button>
            </div>
          </div>
          <div className="relative animate-float">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Business strategy meeting with AI augmentation" 
              className="rounded-xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">90-Day AI Action Plan</p>
                  <p className="text-sm text-gray-500">Get started in a week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
