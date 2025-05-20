import Parser from 'rss-parser';
import { NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

// Define the RSS feed URL environment variable
const RSS_FEED_URL = process.env.RSS_FEED_URL;

// Set edge runtime (as per the skeleton comments)
export const runtime = 'edge';

// Set revalidation period
export const revalidate = 3600; // 1 hour

// Custom parser type for GHL RSS feed structure
interface GHLItem {
  title: string;
  link: string;
  pubDate: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  categories?: string[];
  'media:content'?: {
    $: {
      url: string;
      medium: string;
      type: string;
    };
  }[];
  'content:encoded'?: string;
  'dc:creator'?: string;
}

// Setup RSS Parser with comprehensive custom fields
const parser = new Parser<{ items: GHLItem[] }>({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['content:encoded', 'content:encoded'],
      ['dc:creator', 'dc:creator'],
    ],
  },
});

/**
 * GET handler for /api/blog/posts
 * Fetches and parses RSS feed from GoHighLevel or another source
 */
export async function GET() {
  try {
    // Check if RSS_FEED_URL is defined
    if (!RSS_FEED_URL) {
      return NextResponse.json(
        { error: 'RSS feed URL is not configured' },
        { status: 500 }
      );
    }

    // Fetch and parse RSS feed
    const feed = await parser.parseURL(RSS_FEED_URL);
    
    // Map RSS items to blog post format
    const posts = feed.items.map((item, index) => {
      // Generate a unique ID
      const id = index + 1;
      
      // Generate slug from title or use a portion of the link
      const title = item.title || 'Untitled Post';
      const slug = item.link?.split('/').pop() || 
        title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      
      // Get content from various possible sources
      const content = item['content:encoded'] || item.content || '';
      
      // Clean content with DOMPurify
      const cleanContent = DOMPurify.sanitize(content);
      
      // Extract a short excerpt
      let excerpt = item.contentSnippet || '';
      if (!excerpt && content) {
        // Strip HTML and get first 150 chars
        excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
      }
      
      // Get image if available
      let imageUrl = '';
      if (item['media:content'] && item['media:content'][0] && item['media:content'][0].$) {
        imageUrl = item['media:content'][0].$.url;
      } else if (content) {
        // Try to extract image from content
        const imgMatch = /<img[^>]+src="([^"]+)"/.exec(content);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
      
      // Get author information
      const author = item['dc:creator'] || item.creator || 'Strategix AI Team';
      
      // Parse tags/categories
      const tags = item.categories || [];
      
      return {
        id,
        title,
        slug,
        content: cleanContent,
        excerpt,
        author,
        publishedAt: item.pubDate,
        imageUrl,
        tags
      };
    });

    // Return the formatted blog posts
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 