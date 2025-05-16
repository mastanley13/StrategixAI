import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CTASection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/intake", formData);
      
      toast({
        title: "Success!",
        description: "Your discovery call has been scheduled. We'll be in touch shortly.",
      });
      
      setFormData({
        name: "",
        email: "",
        company: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-call" className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Ready to reclaim your hours?</h2>
            <p className="text-xl text-gray-300 mb-8">Book a free 30-minute Discovery Call and walk away with a no-nonsense game-plan for your top three bottlenecks—on us.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" className="bg-accent hover:bg-accent/90">
                Book Call
              </Button>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
                Email
              </Button>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
                LinkedIn
              </Button>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Schedule Your Discovery Call</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">What's your biggest operational challenge?</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={3} 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="w-full" 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Book My Call"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
