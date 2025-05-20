'use client';

import { useState } from 'react';

// Form state type
interface FormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

// Form submission result
interface SubmissionResult {
  success: boolean;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      setResult({
        success: false,
        message: 'Please fill in your name and email.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });
      
      setResult({
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error 
          ? error.message 
          : 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="container mx-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Get in touch with our team to discuss how we can help your business leverage AI.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {result && (
              <div className={`p-4 mb-6 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p>{result.message}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  What's your biggest operational challenge?
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your challenges"
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Book My Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Email Us</h3>
            <p className="text-gray-600">
              For general inquiries: <a href="mailto:info@strategixai.co" className="text-blue-600 hover:underline">info@strategixai.co</a>
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Call Us</h3>
            <p className="text-gray-600">
              Call our team: <a href="tel:+15551234567" className="text-blue-600 hover:underline">+1 (555) 123-4567</a>
            </p>
          </div>
        </div>
      </div>
      
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to reclaim your hours?</h2>
              <p className="text-xl text-gray-300 mb-8">Book a free 30-minute Discovery Call and walk away with a no-nonsense game-plan for your top three bottlenecks—on us.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#top"
                  className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
                >
                  Book Call
                </a>
                <a 
                  href="mailto:info@strategixai.co"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border-transparent rounded-md"
                >
                  Email
                </a>
                <a 
                  href="#"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border-transparent rounded-md"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 