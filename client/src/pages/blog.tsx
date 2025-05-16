import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Link } from 'wouter';

// Types
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

// Fetch functions
const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch('/api/blog');
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }
  return response.json();
};

export default function Blog() {
  // Fetch blog posts using React Query
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
  });
  
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
  
  if (isError) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Error: {(error as Error).message}</p>
          <Link href="/blog-debug" className="text-blue-600 hover:underline mt-2 inline-block">
            Debug RSS Feed
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold">Our Blog</h1>
        
        {/* Debug link - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <Link href="/blog-debug" className="text-sm text-blue-600 hover:underline">
            Debug RSS Feed
          </Link>
        )}
      </div>
      
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform hover:translate-y-[-5px] hover:shadow-lg">
              {post.imageUrl ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <span className="text-xl font-bold">StrategixAI</span>
                </div>
              )}
              
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                  {post.author && (
                    <span className="ml-2">
                      • by {post.author}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mb-3 hover:text-blue-600">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  className="text-blue-600 hover:underline flex items-center mt-auto"
                >
                  Read More 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
          <Link href="/blog-debug" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Debug RSS Feed
          </Link>
        </div>
      )}
    </div>
  );
} 