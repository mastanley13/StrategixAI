import Link from 'next/link';
import { notFound } from 'next/navigation';

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

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug);
    return {
      title: `${post.title} - Strategix AI Blog`,
      description: post.excerpt,
    };
  } catch (error) {
    return {
      title: 'Blog Post - Strategix AI',
      description: 'Insights on AI strategy and implementation.',
    };
  }
}

// Fetch a blog post by slug
async function getBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/posts`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }
  
  const posts: BlogPost[] = await response.json();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  return post;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post: BlogPost | null = null;
  let error = null;
  
  try {
    post = await getBlogPost(params.slug);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load blog post';
    console.error('Error fetching blog post:', err);
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
          <Link href="/blog" className="text-blue-600 hover:underline mt-2 inline-block">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link href="/blog" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.imageUrl && (
          <div className="h-72 md:h-96 overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.author && (
              <span>by {post.author}</span>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </article>
      
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-6">
          Contact us today to learn how we can help your business leverage AI.
        </p>
        <Link 
          href="/contact" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
} 