import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "Difference between a 1-Day and 5-Day Deep-Dive?",
      answer: "A 1-Day Deep-Dive focuses on a single workflow or process, providing targeted recommendations for immediate implementation. Our 3-Day option expands to cover multiple interconnected processes, while the 5-Day comprehensive engagement maps your entire operational ecosystem, delivering a strategic transformation roadmap with phased implementation plans and ROI projections for each initiative."
    },
    {
      question: "Do you replace our existing software?",
      answer: "Not necessarily. We often integrate with and enhance your existing systems. Our approach focuses on identifying gaps in your current tech stack and creating custom connectors and automations that allow your existing software to work better together. If we determine a system needs replacement, we'll always provide a clear cost-benefit analysis comparing enhancement vs. replacement options."
    },
    {
      question: "How fast can we be live?",
      answer: "Initial workflow automations typically launch within 2-3 weeks. Our voice AI solutions can be answering calls in as little as 10 days. Comprehensive platform builds follow our 90-day roadmap with phased releases, delivering incremental value at each milestone rather than waiting for a single big launch. We always prioritize quick wins that show immediate ROI while larger initiatives are in development."
    },
    {
      question: "What does ongoing support include?",
      answer: "Standard support includes a dedicated Slack/Teams channel for your team, 48-hour response SLA for change requests, quarterly performance reviews, and 99.9% uptime guarantees for our hosted solutions. Enterprise clients can add 24/7 emergency response, custom SLAs, and embedded team members. All clients receive monthly usage analytics and optimization recommendations as part of our continuous improvement model."
    },
    {
      question: "Typical pricing ranges?",
      answer: "Discovery Sprints range from $2,500 (1-day) to $15,000 (5-day) and include your actionable roadmap. Implementation projects typically range from $10,000-$50,000 for initial builds with monthly support starting at $1,500. Voice AI implementations start at $5,000 with monthly fees based on call volume. All projects include clear ROI projections and most clients see positive returns within the first quarter of implementation."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 mb-6"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="bg-gray-50 px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
