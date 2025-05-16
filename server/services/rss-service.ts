import Parser from 'rss-parser';
import { storage } from '../storage';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import axios from 'axios';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';
// Force real feed: Always use the real feed
const forceRealFeed = true;

// Create a dom window for sanitization
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Mock blog posts for development
const mockBlogPosts = [
  {
    title: 'Getting Started with AI in Business',
    slug: 'getting-started-with-ai-in-business',
    content: '<p>Artificial Intelligence (AI) is revolutionizing how businesses operate today. From automating routine tasks to providing deep insights from data, AI technologies offer numerous benefits to organizations of all sizes.</p><p>In this article, we explore the practical steps businesses can take to begin incorporating AI into their operations effectively.</p>',
    excerpt: 'Artificial Intelligence (AI) is revolutionizing how businesses operate today. From automating routine tasks to providing deep insights from data...',
    author: 'Jane Smith',
    publishedAt: new Date('2025-01-15'),
    imageUrl: 'https://picsum.photos/seed/ai1/800/600',
    tags: ['AI', 'Business', 'Technology'],
    ghlId: 'mock-1',
    lastFetched: new Date()
  },
  {
    title: 'The Future of Strategic Planning with Machine Learning',
    slug: 'future-of-strategic-planning-with-ml',
    content: '<p>Machine Learning is transforming how businesses approach strategic planning. By analyzing vast amounts of historical data, ML algorithms can identify patterns and trends that humans might miss.</p><p>This article examines how forward-thinking companies are leveraging ML to gain competitive advantages in their strategic planning processes.</p>',
    excerpt: 'Machine Learning is transforming how businesses approach strategic planning. By analyzing vast amounts of historical data...',
    author: 'John Doe',
    publishedAt: new Date('2025-02-22'),
    imageUrl: 'https://picsum.photos/seed/ml1/800/600',
    tags: ['Machine Learning', 'Strategy', 'Innovation'],
    ghlId: 'mock-2',
    lastFetched: new Date()
  },
  {
    title: 'Implementing Data-Driven Decision Making in Your Organization',
    slug: 'implementing-data-driven-decision-making',
    content: '<p>Data-driven decision making has become essential for businesses looking to stay competitive. By basing decisions on objective data rather than intuition alone, organizations can achieve better outcomes.</p><p>This article provides a step-by-step guide for implementing data-driven practices across your organization.</p>',
    excerpt: 'Data-driven decision making has become essential for businesses looking to stay competitive. By basing decisions on objective data rather than intuition alone...',
    author: 'Sarah Johnson',
    publishedAt: new Date('2025-03-10'),
    imageUrl: 'https://picsum.photos/seed/data1/800/600',
    tags: ['Data', 'Decision Making', 'Analytics'],
    ghlId: 'mock-3',
    lastFetched: new Date()
  }
];

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
  'content:encoded'?: string;
  'dc:creator'?: string;
}

// Setup RSS Parser with more comprehensive custom fields
const parser = new Parser<{ items: GHLItem[] }>({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['content:encoded', 'content:encoded'],
      ['dc:creator', 'dc:creator'],
    ],
  },
});

// Get RSS feed URL from environment and properly encode it if needed
const getRssFeedUrl = (): string | null => {
  const url = process.env.RSS_FEED_URL;
  if (!url) return null;
  
  try {
    console.log('Original RSS feed URL:', url);
    
    // Check if URL contains unencoded ampersands and other special characters
    if (url.includes('&') && !url.includes('%26')) {
      // This is a simple check - real implementation should be more robust
      // Replace unencoded ampersands with encoded version
      const parts = url.split('?');
      if (parts.length > 1) {
        const baseUrl = parts[0];
        const params = new URLSearchParams(parts[1]);
        const encodedUrl = baseUrl + '?' + params.toString();
        console.log('Encoded RSS feed URL:', encodedUrl);
        return encodedUrl;
      }
    }
    
    return url;
  } catch (error) {
    console.error('Error processing RSS feed URL:', error);
    return url; // Return original URL if encoding fails
  }
};

const RSS_FEED_URL = getRssFeedUrl();

/**
 * Directly fetch RSS XML content via HTTP for debugging
 */
async function debugFetchRss(url: string): Promise<string> {
  try {
    console.log(`[DEBUG] Fetching raw RSS from ${url}`);
    
    // Add timeout and headers to improve request reliability
    const response = await axios.get(url, {
      timeout: 15000, // 15 seconds timeout
      headers: {
        'User-Agent': 'StrategixAI/1.0 RSS-Reader',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    
    console.log(`[DEBUG] Response status: ${response.status}`);
    console.log(`[DEBUG] Response headers:`, response.headers);
    console.log(`[DEBUG] Response data (first 500 chars):`);
    console.log(response.data.substring(0, 500));
    
    return response.data;
  } catch (error: any) {
    console.error('[DEBUG] Error fetching raw RSS:', error.message);
    if (error.response) {
      console.error(`[DEBUG] Response status: ${error.response.status}`);
      console.error('[DEBUG] Response headers:', error.response.headers);
      if (error.response.data) {
        console.error('[DEBUG] Error response data:', 
          typeof error.response.data === 'string' 
            ? error.response.data.substring(0, 200) 
            : JSON.stringify(error.response.data).substring(0, 200)
        );
      }
    } else if (error.request) {
      console.error('[DEBUG] No response received, request details:', error.request._currentUrl);
    }
    throw error;
  }
}

/**
 * Create a blog post from the Go High Level data
 * This processes actual GHL blog post data into the format we need
 */
function createBlogPostFromGhlData(data: any, isPublished = true): any {
  // Generate a unique ID if one isn't provided
  const ghlId = data.guid || data.link?.split('/').pop() || `ghl-${Date.now()}`;
  
  // Generate slug from title
  const title = data.title || 'Untitled Post';
  const slug = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  
  // Get content from various possible sources
  const content = data.content || data['content:encoded'] || data.description || '';
  
  // Extract a short excerpt
  let excerpt = data.contentSnippet || '';
  if (!excerpt && content) {
    // Strip HTML and get first 150 chars
    excerpt = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  }
  
  // Get image if available - use imageUrl if directly provided from manual parsing
  let imageUrl = '';
  if (data.imageUrl) {
    imageUrl = data.imageUrl;
  } else if (data['media:content'] && data['media:content'][0] && data['media:content'][0].$) {
    imageUrl = data['media:content'][0].$.url;
  } else if (content) {
    // Try to extract image from content
    const imgMatch = /<img[^>]+src="([^"]+)"/.exec(content);
    if (imgMatch) {
      imageUrl = imgMatch[1];
    }
  }
  
  console.log(`Creating blog post: "${title}" with image: ${imageUrl || 'No image'}`);
  
  // Date handling
  let publishedAt;
  try {
    publishedAt = data.pubDate ? new Date(data.pubDate) : new Date();
  } catch (e) {
    console.error('Error parsing date:', e);
    publishedAt = new Date();
  }
  
  // Get tags/categories
  const tags = Array.isArray(data.categories) ? data.categories : [];
  
  // Create the blog post object
  return {
    ghlId,
    title,
    slug,
    content: purify.sanitize(content),
    excerpt,
    author: data.creator || data['dc:creator'] || 'StrategixAI',
    publishedAt,
    imageUrl,
    tags,
    lastFetched: new Date(),
    isPublished
  };
}

/**
 * Create a sample blog post for Go High Level
 */
function createSampleBlogPost(): any {
  return {
    ghlId: 'sample-1',
    title: 'Sample Post from Go High Level',
    slug: 'sample-post-from-go-high-level',
    content: '<p>This is a sample post created because we could not fetch from the Go High Level RSS feed.</p><p>Check the blog-debug page for more information on why the feed could not be accessed.</p>',
    excerpt: 'This is a sample post created because we could not fetch from the Go High Level RSS feed.',
    author: 'System',
    publishedAt: new Date(),
    imageUrl: 'https://picsum.photos/seed/sample/800/600',
    tags: ['Sample', 'Go High Level'],
    lastFetched: new Date()
  };
}

/**
 * Try to parse the feed using several different methods
 */
async function attemptFeedParsing(url: string) {
  console.log('Attempting to parse feed using multiple methods');
  
  // First try with direct manual parsing for maximum control
  try {
    console.log('Method 0: Direct raw XML parsing');
    const xmlData = await debugFetchRss(url);
    console.log('Raw XML data length:', xmlData.length);
    console.log('XML sample:', xmlData.substring(0, 300));
    
    // Check if this is likely a valid RSS feed
    const isValid = xmlData.includes('<rss') && xmlData.includes('<channel>');
    if (!isValid) {
      console.warn('XML data does not appear to be a valid RSS feed');
    }
    
    const items = parseGoHighLevelRSS(xmlData);
    
    console.log(`Success! Extracted ${items.length} items with direct parsing`);
    if (items.length > 0) {
      console.log('Sample item:', JSON.stringify(items[0], null, 2).substring(0, 300));
    }
    
    return { items };
  } catch (error: any) {
    console.error('Method 0 failed:', error.message);
  }
  
  // Then try the other methods if manual extraction fails
  
  // First try direct parser
  try {
    console.log('Method 1: Using RSS parser directly');
    const feed = await parser.parseURL(url);
    console.log(`Success! Found ${feed.items.length} items`);
    if (feed.items.length > 0) {
      console.log('Sample item:', JSON.stringify(feed.items[0], null, 2).substring(0, 200));
    }
    return feed;
  } catch (error: any) {
    console.error('Method 1 failed:', error.message);
  }
  
  // Then try fetching with axios and parsing the result
  try {
    console.log('Method 2: Fetching with axios and parsing string');
    const xmlData = await debugFetchRss(url);
    
    const feed = await parser.parseString(xmlData);
    console.log(`Success! Found ${feed.items.length} items`);
    if (feed.items.length > 0) {
      console.log('Sample item:', JSON.stringify(feed.items[0], null, 2).substring(0, 200));
    }
    return feed;
  } catch (error: any) {
    console.error('Method 2 failed:', error.message);
  }
  
  // Try with a URL object to ensure proper encoding
  try {
    console.log('Method 3: Using URL object for better encoding');
    const urlObj = new URL(url);
    const feed = await parser.parseURL(urlObj.toString());
    console.log(`Success! Found ${feed.items.length} items`);
    if (feed.items.length > 0) {
      console.log('Sample item:', JSON.stringify(feed.items[0], null, 2).substring(0, 200));
    }
    return feed;
  } catch (error: any) {
    console.error('Method 3 failed:', error.message);
  }
  
  throw new Error('All parsing methods failed');
}

/**
 * Specialized parser for Go High Level RSS feeds
 */
export function parseGoHighLevelRSS(xmlData: string): any[] {
  console.log('Parsing Go High Level RSS feed...');
  
  // Check if this is a Go High Level-formatted feed
  const isGHL = xmlData.includes('StrategixAI') || xmlData.includes('Go High Level');
  console.log('Is likely a Go High Level feed:', isGHL);
  
  // This function is designed specifically for the structure observed in Go High Level feeds
  const items = [];
  
  try {
    // Extract the channel information
    const channelMatch = /<channel>([\s\S]*?)<\/channel>/i.exec(xmlData);
    if (!channelMatch) {
      console.error('No channel tag found in RSS feed');
      return [];
    }
    
    const channelContent = channelMatch[1];
    console.log('Channel content length:', channelContent.length);
    
    // Get site title
    const siteTitle = extractXmlTag(channelContent, 'title') || 'Unknown Site';
    console.log('Site title:', siteTitle);
    
    // Find all item blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    let itemCount = 0;
    
    while ((match = itemRegex.exec(channelContent)) !== null) {
      itemCount++;
      const itemXml = match[1]; // The content inside <item> tags
      console.log(`Found item ${itemCount}, content length: ${itemXml.length}`);
      
      try {
        // Extract key fields
        const title = extractXmlTag(itemXml, 'title');
        if (!title) {
          console.warn(`Item ${itemCount} has no title, skipping`);
          continue;
        }
        
        const link = extractXmlTag(itemXml, 'link') || '';
        const pubDate = extractXmlTag(itemXml, 'pubDate') || '';
        let content = extractXmlTag(itemXml, 'content:encoded') || 
                      extractXmlTag(itemXml, 'description') || '';
                      
        // Extract image URL
        let imageUrl = '';
        
        // Try to extract from media:content tag (preferred)
        const mediaContent = extractXmlTag(itemXml, 'media:content', true);
        if (mediaContent) {
          const urlMatch = /url="([^"]+)"/i.exec(mediaContent);
          if (urlMatch && urlMatch[1]) {
            imageUrl = urlMatch[1];
            console.log(`Found image URL in media:content: ${imageUrl.substring(0, 50)}`);
          }
        }
        
        // If no image found and we have content, try to extract from HTML
        if (!imageUrl && content && content.includes('<img')) {
          const imgSrcMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(content);
          if (imgSrcMatch && imgSrcMatch[1]) {
            imageUrl = imgSrcMatch[1];
            console.log(`Found image URL in content: ${imageUrl.substring(0, 50)}`);
          }
        }
        
        // Create excerpt from content
        let excerpt = '';
        if (content) {
          // Remove HTML tags and get first 200 chars
          excerpt = content.replace(/<[^>]+>/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim()
                         .substring(0, 200);
          if (excerpt.length === 200) {
            excerpt += '...';
          }
        }
        
        // Add the item to our collection
        items.push({
          title,
          link,
          pubDate,
          content,
          contentSnippet: excerpt,
          imageUrl,
          // Generate a unique ID from title
          guid: link || `ghl-post-${Date.now()}-${itemCount}`,
          categories: []  // Go High Level posts might not have categories
        });
        
        console.log(`Successfully parsed item: "${title}"`);
      } catch (itemError: any) {
        console.error(`Error parsing item ${itemCount}:`, itemError.message);
      }
    }
    
    console.log(`Completed parsing ${itemCount} items, successfully extracted ${items.length} posts`);
    return items;
  } catch (error: any) {
    console.error('Error in parseGoHighLevelRSS:', error.message);
    return [];
  }
}

// Helper function to extract content from XML tags with additional options
function extractXmlTag(xml: string, tagName: string, includeTag: boolean = false): string | null {
  if (!xml || !tagName) return null;
  
  let regex;
  if (includeTag) {
    // Return the entire tag including attributes
    regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 's');
    const match = regex.exec(xml);
    if (match) {
      return `<${tagName}${match[0].split('<')[1].split('>')[0].slice(tagName.length)}>${match[1]}</${tagName}>`;
    }
  } else {
    // Regular content extraction
    regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 's');
    const match = regex.exec(xml);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Fetch and process the GHL blog RSS feed
 */
export async function fetchAndStoreBlogPosts() {
  console.log(`Fetching blog posts with isDev=${isDev}, forceRealFeed=${forceRealFeed}`);
  
  // In development mode, use mock data (unless forceRealFeed is true)
  if (isDev && !forceRealFeed) {
    console.log('Development mode: Using mock blog posts');
    
    // Add each mock post to the database
    for (const post of mockBlogPosts) {
      const existingPost = await storage.getBlogPostBySlug(post.slug);
      
      if (!existingPost) {
        await storage.createBlogPost(post);
        console.log(`Created mock blog post: ${post.title}`);
      }
    }
    
    return mockBlogPosts.length;
  }

  // In production or when forceRealFeed is true, fetch from real RSS feed
  if (!RSS_FEED_URL) {
    console.error('RSS_FEED_URL is not defined in environment variables');
    console.log('Please create a .env.local file with RSS_FEED_URL="your-rss-url"');
    // Fall back to adding a sample post
    await storage.createBlogPost(createSampleBlogPost());
    return 1;
  }

  try {
    console.log('Fetching blog posts from RSS feed:', RSS_FEED_URL);
    
    // Try to parse feed with multiple methods
    const feed = await attemptFeedParsing(RSS_FEED_URL);
    
    console.log(`Found ${feed.items.length} items in the feed`);
    console.log('First item:', JSON.stringify(feed.items[0] || {}, null, 2).substring(0, 300));
    
    if (feed.items.length === 0) {
      console.warn('Feed contained 0 items. Adding a sample post as fallback.');
      await storage.createBlogPost(createSampleBlogPost());
      return 1;
    }
    
    // Clear existing blog posts if specified by environment variable
    if (process.env.CLEAR_EXISTING_POSTS === 'true') {
      console.log('Clearing existing blog posts before importing new ones');
      // This would require a new method in storage.ts
      // await storage.clearBlogPosts();
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each item from the feed
    for (const item of feed.items) {
      try {
        console.log(`Processing item: ${item.title || 'Untitled'}, URL: ${item.link || 'No link'}`);
        
        // Use our helper function to create a blog post object
        const blogPostData = createBlogPostFromGhlData(item, true);
        
        // Check if post exists
        const existingPost = await storage.getBlogPostBySlug(blogPostData.slug);
        
        if (existingPost) {
          // Update existing post
          await storage.updateBlogPost(existingPost.id, {
            title: blogPostData.title,
            content: blogPostData.content,
            excerpt: blogPostData.excerpt,
            author: blogPostData.author,
            publishedAt: blogPostData.publishedAt,
            imageUrl: blogPostData.imageUrl,
            tags: blogPostData.tags,
            lastFetched: new Date()
          });
          console.log(`Updated blog post: ${blogPostData.title}`);
          successCount++;
        } else {
          // Create new post
          await storage.createBlogPost(blogPostData);
          console.log(`Created new blog post: ${blogPostData.title}`);
          successCount++;
        }
      } catch (error) {
        console.error('Error processing feed item:', error);
        errorCount++;
      }
    }
    
    console.log(`Processed ${feed.items.length} blog posts from RSS feed. Success: ${successCount}, Errors: ${errorCount}`);
    
    // If all items failed to process, add a sample post
    if (successCount === 0 && feed.items.length > 0) {
      console.log('No items were successfully processed. Adding a sample post as fallback.');
      await storage.createBlogPost(createSampleBlogPost());
    }
    
    return successCount;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    
    // Add a sample post if there was an error
    console.log('Adding a sample post due to error fetching RSS feed');
    await storage.createBlogPost(createSampleBlogPost());
    
    return 1;
  }
}

/**
 * Schedule regular updates of blog posts
 * @param intervalMinutes How often to check for updates in minutes
 */
export function scheduleRSSUpdates(intervalMinutes = 60) {
  // Run immediately on startup
  fetchAndStoreBlogPosts().catch(error => {
    console.error('Error in initial blog post fetch:', error);
  });
  
  // Don't schedule regular updates in development (unless forceRealFeed is true)
  if (isDev && !forceRealFeed) {
    console.log('Development mode: Skipping RSS update scheduling');
    return null;
  }
  
  // Schedule regular updates in production or when forceRealFeed is true
  const intervalMs = intervalMinutes * 60 * 1000;
  console.log(`Scheduling RSS updates every ${intervalMinutes} minutes`);
  return setInterval(() => {
    fetchAndStoreBlogPosts().catch(error => {
      console.error('Error in scheduled blog post fetch:', error);
    });
  }, intervalMs);
} 