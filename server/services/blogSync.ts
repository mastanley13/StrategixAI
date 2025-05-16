import Parser from 'rss-parser';
import { storage } from '../storage';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { log } from '../vite';

// Create a DOM window for HTML sanitization
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Custom parser type to handle GHL RSS feed structure
interface GHLItem {
  title: string;
  link: string;
  pubDate: string;
  guid?: string;
  creator?: string;
  content?: string;
  'content:encoded'?: string;
  contentSnippet?: string;
  categories?: string[];
  'media:content'?: {
    $: {
      url: string;
      medium: string;
      type: string;
    };
  }[];
}

// Setup RSS Parser with custom fields for GHL
const parser = new Parser<{ items: GHLItem[] }>({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['content:encoded', 'content:encoded'],
      ['dc:creator', 'creator'],
    ],
  },
});

/**
 * Get published blog posts from Go High Level via RSS feed
 */
export async function fetchRssFeed(): Promise<GHLItem[]> {
  const url = process.env.RSS_FEED_URL;
  
  if (!url) {
    throw new Error('RSS_FEED_URL is not defined in environment variables');
  }
  
  try {
    log(`Fetching RSS feed from: ${url}`);
    const feed = await parser.parseURL(url);
    
    log(`Found ${feed.items.length} items in the RSS feed`);
    return feed.items;
  } catch (error) {
    log(`Error fetching RSS feed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Convert GHL RSS item to blog post format
 */
function convertRssItemToBlogPost(item: GHLItem) {
  // Use guid or link or generate a unique ID based on title
  const ghlId = item.guid || item.link?.split('/').pop() || `ghl-${Buffer.from(item.title || 'untitled').toString('base64')}`;
  
  // Generate slug from title
  const title = item.title || 'Untitled Post';
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  
  // Get HTML content from content:encoded or content
  const content = item['content:encoded'] || item.content || '';
  
  // Create excerpt
  const excerpt = item.contentSnippet || 
    (content ? content.replace(/<[^>]+>/g, ' ').trim().substring(0, 200) + '...' : 'No excerpt available');
  
  // Get image URL if available
  let imageUrl = '';
  
  // First try from media:content
  if (item['media:content'] && item['media:content'][0] && item['media:content'][0].$) {
    imageUrl = item['media:content'][0].$.url;
  }
  
  // If no image found, try to extract from HTML content
  if (!imageUrl && content) {
    const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(content);
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1];
    }
  }
  
  // Parse publication date
  const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
  
  // Get categories/tags
  const tags = item.categories || [];
  
  // Return blog post object
  return {
    ghlId,
    title,
    slug,
    content: purify.sanitize(content),
    excerpt,
    author: item.creator || 'StrategixAI',
    publishedAt,
    imageUrl,
    tags,
    lastFetched: new Date()
  };
}

/**
 * Sync blog posts from RSS feed to database
 * @param forceUpdate If true, update existing posts with fresh content
 * @returns Object with count of imported posts and updated posts
 */
export async function syncBlogPosts(forceUpdate: boolean = false): Promise<{ imported: number; updated: number }> {
  try {
    // Fetch posts from RSS feed
    const rssItems = await fetchRssFeed();
    
    // Track successfully imported and updated posts
    let importedCount = 0;
    let updatedCount = 0;
    
    // Process each RSS item
    for (const item of rssItems) {
      try {
        // Skip items without title
        if (!item.title) {
          log('Skipping RSS item without title');
          continue;
        }
        
        // Convert RSS item to blog post
        const blogPost = convertRssItemToBlogPost(item);
        
        // Check if post already exists by slug
        const existingPost = await storage.getBlogPostBySlug(blogPost.slug);
        
        if (!existingPost) {
          // Only create if post doesn't exist
          await storage.createBlogPost(blogPost);
          log(`Imported new blog post: "${blogPost.title}"`);
          importedCount++;
        } else if (forceUpdate) {
          // Update existing post if forceUpdate is true
          await storage.updateBlogPost(existingPost.id, {
            title: blogPost.title,
            content: blogPost.content,
            excerpt: blogPost.excerpt,
            author: blogPost.author,
            publishedAt: blogPost.publishedAt,
            imageUrl: blogPost.imageUrl,
            tags: blogPost.tags,
            lastFetched: new Date()
          });
          log(`Updated existing blog post: "${blogPost.title}"`);
          updatedCount++;
        } else {
          log(`Blog post "${blogPost.title}" already exists, skipping`);
        }
      } catch (error) {
        // Log error but continue processing other items
        console.error(`Error processing RSS item "${item.title || 'unknown'}":`, error);
      }
    }
    
    log(`Blog sync complete. Imported ${importedCount} new posts, updated ${updatedCount} existing posts from ${rssItems.length} RSS items`);
    return { imported: importedCount, updated: updatedCount };
  } catch (error) {
    console.error('Blog sync failed:', error);
    throw error;
  }
}

/**
 * Get list of blog post titles for quick sanity check
 */
export async function getBlogSummary(): Promise<{ count: number; titles: string[]; ids: number[] }> {
  const posts = await storage.listBlogPosts();
  
  return {
    count: posts.length,
    titles: posts.map(post => post.title),
    ids: posts.map(post => post.id)
  };
}

/**
 * Delete a blog post by ID
 */
export async function deleteBlogPost(id: number): Promise<boolean> {
  try {
    await storage.deleteBlogPost(id);
    return true;
  } catch (error) {
    console.error(`Error deleting blog post ID ${id}:`, error);
    return false;
  }
} 