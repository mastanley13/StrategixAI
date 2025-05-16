import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ProductsSection() {
  const flagshipProducts = [
    {
      name: "Dog-Care Ops Suite",
      status: "Launching Q3 2025",
      statusColor: "yellow",
      description: "Booking, vaccination tracking, billing, staff scheduling, daily pet reports—one login for everything."
    },
    {
      name: "Sales Trainer",
      status: "Enterprise pilots",
      statusColor: "blue",
      description: "AI avatars simulate prospects, coach in real time, and grade calls automatically."
    },
    {
      name: "AI-Ready Websites",
      status: "Live",
      statusColor: "green",
      description: "Conversion-optimised sites wired to workflows from day 1 (starting $1k)."
    },
    {
      name: "Voice-AI Integrations",
      status: "Live",
      statusColor: "green",
      description: "24/7 phone assistants that transact, upsell, and sync to CRM."
    }
  ];

  const services = [
    {
      name: "Deep-Dive Consulting",
      format: "1-, 3-, or 5-day sprint → 90-day Action Plan",
      idealBuyer: "Owners · COOs · Ops VPs"
    },
    {
      name: "Custom Training Curricula",
      format: "Role-specific workshops + on-demand modules",
      idealBuyer: "HR / L&D / Enablement"
    },
    {
      name: "Full-Stack App Builds",
      format: "Guided engagements from prototype to launch",
      idealBuyer: "SMBs → Enterprise"
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">What We Deliver</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
        </div>
        
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-8">Flagship Products</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">What It Solves</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {flagshipProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${product.statusColor}-100 text-${product.statusColor}-800`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{product.description}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-8">High-Touch Services</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h4 className="font-display font-semibold text-xl text-gray-900 mb-2">{service.name}</h4>
                <p className="text-gray-600 mb-4">{service.format}</p>
                <div className="text-primary font-medium">Ideal Buyer</div>
                <p className="text-gray-700">{service.idealBuyer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/solutions">
              <Button className="gap-2">
                Explore All Solutions
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
