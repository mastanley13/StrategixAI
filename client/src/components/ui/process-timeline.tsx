import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProcessStep {
  title: string;
  description: string;
  duration?: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export default function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="process-timeline relative">
      {/* Timeline Track - Only visible on md and up */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 transform -translate-x-1/2"></div>
      
      {/* Process Steps */}
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={cn(
            "process-step grid md:grid-cols-2 gap-8 mb-16 relative", 
            index === steps.length - 1 ? "" : "mb-16"
          )}
        >
          <div className={step.reverse ? "md:order-2" : "md:text-right"}>
            <Card className="inline-block">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {step.duration && <p className="text-gray-600 mt-2">{step.duration}</p>}
              </CardContent>
            </Card>
          </div>
          
          {/* Timeline Node - Only visible on md and up */}
          <div className="hidden md:block absolute left-1/2 top-6 w-6 h-6 bg-primary rounded-full transform -translate-x-1/2"></div>
          
          {/* Mobile Timeline Node */}
          <div className="md:hidden absolute left-0 top-6 w-6 h-6 bg-primary rounded-full"></div>
          
          <div className={cn(
            step.reverse ? "md:order-1" : "", 
            "md:mt-0 mt-12"
          )}>
            <img 
              src={step.imageSrc}
              alt={step.imageAlt}
              className="rounded-xl shadow-md w-full h-auto"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
