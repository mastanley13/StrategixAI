import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import DOMPurify from 'dompurify';

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
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
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
  
  // Check if content is just a placeholder or minimal
  const hasPlaceholderContent = post.content.includes('Custom HTML/CSS/JAVASCRIPT');
  
  // Create clean content - if it's a placeholder, don't include it
  const cleanContent = hasPlaceholderContent 
    ? '' 
    : DOMPurify.sanitize(post.content, {
        ALLOWED_TAGS: [
          'p','br','h1','h2','h3','h4','h5','h6',
          'strong','em','ul','ol','li','a','img',
          'blockquote','pre','code'
        ],
        ALLOWED_ATTR: ['href','src','alt','title','target','rel'],
      });
  
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
          
          {/* Regular content if available */}
          {cleanContent && (
            <div 
              className="post-body prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          )}
          
          {/* Always show our generated content for posts with placeholders */}
          {hasPlaceholderContent && (
            <div className="post-content">
              <h2 className="text-2xl font-semibold mb-6">About {post.title}</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="mb-4">{post.excerpt}</p>
                
                <p className="mb-4">
                  StrategixAI is transforming businesses with innovative AI solutions. 
                  From enhancing customer experiences to boosting productivity, AI is becoming 
                  essential for optimizing operations and driving growth.
                </p>
                
                {post.slug.includes('greenville') && (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-2">Greenville's AI Revolution</h3>
                    <p>
                      Greenville businesses are discovering the power of AI to streamline operations, 
                      enhance customer interactions, and gain competitive advantages in today's digital marketplace.
                      Our tailored solutions help local businesses of all sizes leverage advanced AI technologies 
                      without the complexity.
                    </p>
                  </div>
                )}
                
                {post.slug.includes('new-bern') && (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-2">AI Innovation in New Bern</h3>
                    <p>
                      New Bern businesses are embracing AI to transform their operations and better serve 
                      their customers. From retail to hospitality, healthcare to professional services, 
                      AI solutions are helping local companies work smarter and achieve better results.
                    </p>
                  </div>
                )}
                
                <h3 className="text-xl font-medium mb-2">How StrategixAI Can Help</h3>
                <p className="mb-4">
                  Our team of experts specializes in developing and implementing customized AI solutions 
                  for businesses of all sizes. We handle the technical complexity, so you can focus on 
                  what matters most: growing your business and serving your customers.
                </p>
                
                <ul className="list-disc pl-6 mb-6">
                  <li>Custom AI strategy development</li>
                  <li>AI-powered customer service solutions</li>
                  <li>Data analysis and business intelligence</li>
                  <li>Process automation and optimization</li>
                  <li>AI integration with existing systems</li>
                </ul>
              </div>
              
              <div className="mt-8">
                <p className="text-gray-700 mb-4">
                  Ready to learn how AI can transform your business? Contact us today to schedule a consultation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/contact" 
                    className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                  >
                    Contact Us
                  </Link>
                  <Link 
                    href="/solutions" 
                    className="inline-block border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-50"
                  >
                    Our Solutions
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
} 