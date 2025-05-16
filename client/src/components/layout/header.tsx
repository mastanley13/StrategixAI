import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
    { name: "Process", path: "/process" },
    { name: "Results", path: "/results" },
    { name: "Team", path: "/team" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <header className={cn(
      "fixed w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-primary font-display font-bold text-2xl">
                Strategix<span className="text-accent">AI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "font-medium transition-colors",
                  location === item.path 
                    ? "text-primary" 
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link href="#book-call">
              <Button>Book Call</Button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "block font-medium",
                location === item.path 
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            href="#book-call"
            className="block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors"
          >
            Book Call
          </Link>
        </div>
      </div>
    </header>
  );
}
