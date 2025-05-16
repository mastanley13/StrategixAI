import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
}

export default function TestimonialCarousel({ 
  testimonials, 
  autoPlayInterval = 6000 
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const rotateTestimonials = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  // Setup the rotation interval
  useEffect(() => {
    intervalRef.current = setInterval(rotateTestimonials, autoPlayInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rotateTestimonials, autoPlayInterval]);

  // Reset interval when manually changing testimonial
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(rotateTestimonials, autoPlayInterval);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-8">
        <div className="testimonial-container">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={cn(
                "testimonial-slide transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "opacity-0 hidden"
              )}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.author} testimonial`} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
                <div>
                  <svg className="h-10 w-10 text-primary/20 mb-3" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-lg text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              className={cn(
                "w-3 h-3 rounded-full mx-1 transition-colors",
                index === activeIndex ? "bg-primary/50" : "bg-gray-200"
              )}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
