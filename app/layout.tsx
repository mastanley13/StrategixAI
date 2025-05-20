import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Strategix AI - AI Consulting, Automation & Training',
  description: 'AI-powered strategies for modern business growth and optimization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 bg-white z-50 shadow-sm">
          <div className="container mx-auto py-4 px-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                <Link href="/" className="text-blue-600 font-bold">
                  Strategix<span className="text-orange-500">AI</span>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/solutions" className="text-gray-700 hover:text-blue-600">Solutions</Link>
                <Link href="/process" className="text-gray-700 hover:text-blue-600">Process</Link>
                <Link href="/results" className="text-gray-700 hover:text-blue-600">Results</Link>
                <Link href="/team" className="text-gray-700 hover:text-blue-600">Team</Link>
                <Link href="/faq" className="text-gray-700 hover:text-blue-600">FAQ</Link>
                <Link href="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
                <Link href="/contact" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Book Call
                </Link>
              </nav>
              {/* Mobile Menu Button - Would require client-side JS to toggle */}
              <button className="md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-gray-800 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="mb-6 md:mb-0">
                <Link href="/" className="text-white font-bold text-2xl">
                  Strategix<span className="text-orange-500">AI</span>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>&copy; {new Date().getFullYear()} Strategix AI, LLC · New Bern, NC – Veteran-Owned · U.S.-Based · Security-First</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 