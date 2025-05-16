import Parser from 'rss-parser';
import { storage } from '../storage';
import { sanitize } from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a dom window for sanitization
const window = new JSDOM('').window;
const dompurify = sanitize.bind(window);

// Custom parser type to handle GHL RSS feed structure
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
}

// Setup RSS Parser
const parser = new Parser<{ items: GHLItem[] }>({
  customFields: {
    item: [
      'media:content',
      'content:encoded',
      'dc:creator',
    ],
  },
});

// Get RSS feed URL from environment
const RSS_FEED_URL = process.env.RSS_FEED_URL;

/**
 * Fetch and process the GHL blog RSS feed
 */
export async function fetchAndStoreBlogPosts() {
  if (!RSS_FEED_URL) {
    throw new Error('RSS_FEED_URL is not defined in environment variables');
  }

  try {
    console.log('Fetching blog posts from RSS feed...');
    const feed = await parser.parseURL(RSS_FEED_URL);
    
    // Process each item from the feed
    for (const item of feed.items) {
      // Extract blog ID from guid or link
      const ghlId = item.guid || item.link.split('/').pop() || '';
      
      // Generate a URL-friendly slug from the title
      const slug = item.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      
      // Get the image URL if available
      const imageUrl = item['media:content']?.[0]?.$.url || '';
      
      // Sanitize content
      const content = item.content ? dompurify(item.content) : '';
      
      // Format date
      const publishedAt = item.pubDate ? new Date(item.pubDate) : null;
      
      // Extract tags from categories or create empty array
      const tags = item.categories || [];
      
      // Check if post exists
      const existingPost = await storage.getBlogPostBySlug(slug);
      
      if (existingPost) {
        // Update existing post
        await storage.updateBlogPost(existingPost.id, {
          title: item.title,
          content,
          excerpt: item.contentSnippet || '',
          author: item.creator || '',
          publishedAt,
          imageUrl,
          tags,
        });
        console.log(`Updated blog post: ${item.title}`);
      } else {
        // Create new post
        await storage.createBlogPost({
          ghlId,
          title: item.title,
          slug,
          content,
          excerpt: item.contentSnippet || '',
          author: item.creator || '',
          publishedAt,
          imageUrl,
          tags,
          lastFetched: new Date(),
        });
        console.log(`Created new blog post: ${item.title}`);
      }
    }
    
    console.log(`Processed ${feed.items.length} blog posts from RSS feed`);
    return feed.items.length;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
}

/**
 * Schedule regular updates of blog posts
 * @param intervalMinutes How often to check for updates in minutes
 */
export function scheduleRSSUpdates(intervalMinutes = 60) {
  // Run immediately on startup
  fetchAndStoreBlogPosts().catch(console.error);
  
  // Schedule regular updates
  const intervalMs = intervalMinutes * 60 * 1000;
  return setInterval(() => {
    fetchAndStoreBlogPosts().catch(console.error);
  }, intervalMs);
} 