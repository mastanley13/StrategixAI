import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';

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

const fetchBlogPost = async (slug: string): Promise<BlogPost> => {
  const response = await fetch(`/api/blog/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }
  return response.json();
};

export default function BlogPost() {
  // Get the slug from the URL
  const [match, params] = useRoute<{ slug: string }>('/blog/:slug');
  const slug = params?.slug || '';
  
  // Fetch the blog post data
  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => fetchBlogPost(slug),
    enabled: !!slug,
  });
  
  if (isLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }
  
  if (isError || !post) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{(error as Error)?.message || 'Post not found'}</p>
          <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to all posts
      </Link>
      
      <article className="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
        {post.imageUrl && (
          <div className="h-64 sm:h-80 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex items-center mb-8 text-gray-600">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.author && (
              <span className="ml-3">
                • by <span className="font-medium">{post.author}</span>
              </span>
            )}
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
} 