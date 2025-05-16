import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/sections/cta-section";

export default function Solutions() {
  useEffect(() => {
    document.title = "Solutions | Strategix AI";
  }, []);

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Solutions</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 text-lg">
              Tailored AI solutions designed to address your specific business challenges.
            </p>
          </div>

          <div className="space-y-16">
            {/* Deep-Dive AI Consulting */}
            <div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
                3.1 Deep‑Dive AI Consulting
              </h3>
              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <CardContent className="p-8 md:w-2/3">
                    <p className="text-lg text-gray-600 mb-6">
                      Fixed‑fee, fixed‑scope discovery that surfaces high‑ROI automation targets, ranks them, and delivers a 90‑day action plan with timelines, budgets, and KPIs.
                    </p>
                    <Button>Book a Consultation</Button>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Custom Training */}
            <div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
                3.2 Custom Training
              </h3>
              <Card className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <CardContent className="p-8 md:w-2/3">
                    <p className="text-lg text-gray-600 mb-6">
                      Tailored curricula (live + recorded) that cut "time‑to‑self‑sufficiency" by 40% on average.
                    </p>
                    <Button>Request Training Info</Button>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Flagship Products */}
            <div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
                3.3 Flagship Products
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Dog-Care Suite */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Dog-Care Suite</h4>
                    <div className="mb-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Launching Q3 2025
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Booking, vaccination tracking, billing, staff scheduling, daily pet reports—one login for everything.
                    </p>
                    <Button variant="outline" size="sm">Let's Talk</Button>
                  </CardContent>
                </Card>

                {/* Sales Trainer */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Sales Trainer</h4>
                    <div className="mb-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Enterprise pilots
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      AI avatars simulate prospects, coach in real time, and grade calls automatically.
                    </p>
                    <Button variant="outline" size="sm">Let's Talk</Button>
                  </CardContent>
                </Card>

                {/* AI-Ready Websites */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">AI-Ready Websites</h4>
                    <div className="mb-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Live
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Conversion-optimised sites wired to workflows from day 1 (starting $1k).
                    </p>
                    <Button variant="outline" size="sm">Let's Talk</Button>
                  </CardContent>
                </Card>

                {/* Voice-AI Integrations */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Voice-AI Integrations</h4>
                    <div className="mb-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Live
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      24/7 phone assistants that transact, upsell, and sync to CRM.
                    </p>
                    <Button variant="outline" size="sm">Let's Talk</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
