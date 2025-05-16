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
    return <div className="container mx-auto p-8">Loading...</div>;
  }
  
  if (isError) {
    return (
      <div className="container mx-auto p-8 text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10">Our Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                {post.author && (
                  <span className="text-sm text-gray-500 ml-2">
                    • by {post.author}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-3 hover:text-blue-600">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                Read More →
              </Link>
            </div>
          </div>
        ))}
        
        {posts?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500">No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
} 