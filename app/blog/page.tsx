'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Blog post type definition
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
}

// Mock blog posts data
const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "How AI Is Transforming Financial Services in 2024",
    slug: "ai-transforming-financial-services-2024",
    content: "",
    excerpt: "Discover how financial institutions are leveraging AI to enhance customer experiences, improve fraud detection, and streamline operations.",
    author: "John Smith",
    publishedAt: "2024-05-15T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    tags: ["AI", "Fintech", "Machine Learning", "Banking"]
  },
  {
    id: 2,
    title: "5 Ways Small Businesses Can Implement AI Today",
    slug: "5-ways-small-businesses-implement-ai-today",
    content: "",
    excerpt: "Practical approaches for small businesses to leverage AI tools and solutions without extensive technical resources or massive budgets.",
    author: "Amanda Johnson",
    publishedAt: "2024-05-08T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    tags: ["Small Business", "AI Tools", "Productivity", "Automation"]
  },
  {
    id: 3,
    title: "The Future of Healthcare: AI Diagnosis and Treatment Planning",
    slug: "future-healthcare-ai-diagnosis-treatment-planning",
    content: "",
    excerpt: "How artificial intelligence is revolutionizing medical diagnoses, treatment recommendations, and patient care in healthcare settings.",
    author: "Dr. Michael Chen",
    publishedAt: "2024-04-22T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    tags: ["Healthcare", "Medical AI", "Diagnosis", "Patient Care"]
  },
  {
    id: 4,
    title: "Building an Effective AI Strategy for Enterprise",
    slug: "building-effective-ai-strategy-enterprise",
    content: "",
    excerpt: "A comprehensive guide to developing and implementing an AI strategy that aligns with your enterprise business goals and creates measurable value.",
    author: "Sarah Williams",
    publishedAt: "2024-04-15T11:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    tags: ["Enterprise", "AI Strategy", "Digital Transformation", "Leadership"]
  },
  {
    id: 5,
    title: "Ethical Considerations in AI Development and Deployment",
    slug: "ethical-considerations-ai-development-deployment",
    content: "",
    excerpt: "Exploring the ethical implications of AI technologies and frameworks for responsible AI development that businesses should consider.",
    author: "David Garcia",
    publishedAt: "2024-04-03T16:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    tags: ["AI Ethics", "Responsible AI", "Governance", "Technology Policy"]
  },
  {
    id: 6,
    title: "Case Study: AI Automation Increases Productivity by 300%",
    slug: "case-study-ai-automation-increases-productivity",
    content: "",
    excerpt: "Learn how a mid-sized manufacturing company implemented AI-driven automation to dramatically increase productivity and reduce operational costs.",
    author: "Jennifer Lee",
    publishedAt: "2024-03-28T13:10:00Z",
    imageUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    tags: ["Case Study", "Manufacturing", "Automation", "ROI"]
  }
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading for a more realistic experience
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse flex flex-col space-y-4 w-full max-w-2xl">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200"></div>
      <div className="relative container mx-auto px-4 space-y-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Our Blog</h1>
          <p className="text-lg text-gray-600 mt-2">
            Insights and updates from the Strategix AI team
          </p>
        </div>
        
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {post.imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <span className="text-xl font-bold">StrategixAI</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} • by {post.author}
                  </p>
                  
                  <p className="text-gray-700">{post.excerpt}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="mt-4 inline-block text-blue-600 hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">No blog posts found</p>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              We couldn't find any blog posts. This could be because the RSS feed is not properly configured or there are no published posts.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 