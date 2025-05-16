import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "../shared/schema";
import { z } from "zod";
import axios from "axios";
import { parseGoHighLevelRSS } from "./services/rss-service";
import { syncBlogPosts, getBlogSummary, deleteBlogPost } from "./services/blogSync";
import { sendContactConfirmation, sendBookingConfirmation, sendInternalNotification } from "./services/email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Contact form submission - refactored to /api/intake
  app.post("/api/intake", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertContactSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: validationResult.error.errors 
        });
      }
      
      const contactData = validationResult.data;
      
      // Save to database
      const contact = await storage.createContact(contactData);
      
      // Send confirmation email to the user
      const userEmailSent = await sendContactConfirmation({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        message: contactData.message,
        source: contactData.source
      });
      
      // Send notification email to the internal team
      const internalEmailSent = await sendInternalNotification('contact', {
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        message: contactData.message,
        source: contactData.source
      });
      
      // In a production environment, you would also:
      // 1. Push to Go High Level CRM (TODO: implement GHL integration)
      
      res.status(200).json({ 
        message: "Form submitted successfully", 
        contactId: contact.id,
        emailSent: userEmailSent
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Booking endpoint
  app.post("/api/book", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertBookingSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: validationResult.error.errors 
        });
      }
      
      const bookingData = validationResult.data;
      
      // We need contact details for the email
      let contactName = "";
      let contactEmail = "";
      
      // If contactId is provided, get contact details
      if (bookingData.contactId) {
        const contact = await storage.getContactById(bookingData.contactId);
        if (contact) {
          contactName = contact.name;
          contactEmail = contact.email;
        }
      }
      
      // If no contactId or contact not found, use from request body (extending the schema)
      if (!contactName || !contactEmail) {
        contactName = req.body.name || "Customer";
        contactEmail = req.body.email;
        
        // Email is required for sending confirmation
        if (!contactEmail) {
          return res.status(400).json({
            message: "Email is required for booking confirmation",
            errors: ["Email is required"]
          });
        }
      }
      
      // Save to database
      const booking = await storage.createBooking(bookingData);
      
      // Send confirmation email to the user
      const userEmailSent = await sendBookingConfirmation({
        name: contactName,
        email: contactEmail,
        date: bookingData.date,
        service: bookingData.service,
        notes: bookingData.notes
      });
      
      // Send notification email to the internal team
      const internalEmailSent = await sendInternalNotification('booking', {
        name: contactName,
        email: contactEmail,
        date: bookingData.date,
        service: bookingData.service,
        notes: bookingData.notes
      });
      
      // In a production environment, you would also:
      // 1. Schedule in calendar (TODO: implement Calendar integration)
      
      res.status(200).json({ 
        message: "Booking created successfully", 
        bookingId: booking.id,
        emailSent: userEmailSent
      });
    } catch (error) {
      console.error("Error processing booking:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Blog API endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.listBlogPosts();
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Blog Sync API endpoints
  app.post("/api/blog/sync", async (req, res) => {
    try {
      const forceUpdate = req.query.forceUpdate === 'true' || req.body.forceUpdate === true;
      const result = await syncBlogPosts(forceUpdate);
      res.status(200).json({ 
        message: `Blog sync completed. Imported ${result.imported} new posts, updated ${result.updated} existing posts.`,
        ...result
      });
    } catch (error) {
      console.error("Error syncing blog posts:", error);
      res.status(500).json({ 
        message: "Failed to sync blog posts",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  app.get("/api/blog/summary", async (req, res) => {
    try {
      const summary = await getBlogSummary();
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error getting blog summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const success = await deleteBlogPost(id);
      
      if (success) {
        res.status(200).json({ message: "Blog post deleted successfully" });
      } else {
        res.status(404).json({ message: "Blog post not found or could not be deleted" });
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // RSS Feed Debug endpoint
  app.get("/api/debug/rss", async (req, res) => {
    try {
      // Get the feed URL from environment
      const feedUrl = process.env.RSS_FEED_URL;
      
      // Log environment details
      console.log({
        NODE_ENV: process.env.NODE_ENV,
        FETCH_RSS: process.env.FETCH_RSS,
        RSS_FEED_URL: feedUrl
      });
      
      if (!feedUrl) {
        return res.status(400).json({ 
          message: "RSS_FEED_URL is not set in environment variables",
          status: "error",
          envVars: {
            NODE_ENV: process.env.NODE_ENV,
            FETCH_RSS: process.env.FETCH_RSS
          }
        });
      }
      
      // Log the feed URL we're trying to access
      console.log(`Debug: Trying to access RSS feed at ${feedUrl}`);
      
      // Try to fetch the RSS feed directly
      try {
        const response = await axios.get(feedUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'StrategixAI/1.0 RSS-Reader',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          }
        });
        
        // Look for <item> tags in the XML
        const xmlData = response.data;
        const itemCount = (xmlData.match(/<item>/g) || []).length;
        console.log(`Found ${itemCount} <item> tags in XML`);
        
        // Check for common RSS feed elements
        const hasTitleTag = xmlData.includes('<title>');
        const hasChannelTag = xmlData.includes('<channel>');
        const hasItemTags = xmlData.includes('<item>');
        const hasContentEncoded = xmlData.includes('<content:encoded>');
        
        // Return success with response snippet and analytics
        return res.status(200).json({
          message: "RSS feed fetched successfully",
          status: "success",
          statusCode: response.status,
          contentType: response.headers['content-type'],
          dataSnippet: response.data.substring(0, 1000),
          feedAnalysis: {
            totalLength: response.data.length,
            itemCount,
            hasTitleTag,
            hasChannelTag,
            hasItemTags,
            hasContentEncoded
          },
          feedUrl: feedUrl
        });
      } catch (error: any) {
        console.error("Detailed error in debug route:", error);
        
        // Return error details
        return res.status(500).json({
          message: "Error fetching RSS feed",
          status: "error",
          error: error.message,
          response: error.response ? {
            status: error.response.status,
            headers: error.response.headers,
            data: typeof error.response.data === 'string' 
              ? error.response.data.substring(0, 200) 
              : JSON.stringify(error.response.data).substring(0, 200)
          } : null,
          feedUrl: feedUrl
        });
      }
    } catch (error: any) {
      console.error("Unexpected error in debug route:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  });
  
  // RSS parser debug endpoint
  app.get("/api/debug/rss-parser", async (req, res) => {
    try {
      const feedUrl = process.env.RSS_FEED_URL;
      
      if (!feedUrl) {
        return res.status(400).json({ 
          message: "RSS_FEED_URL is not set in environment variables",
          status: "error"
        });
      }
      
      console.log(`Parsing debug: Attempting to parse RSS feed from ${feedUrl}`);
      
      try {
        // Fetch the raw feed
        const response = await axios.get(feedUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'StrategixAI/1.0 RSS-Reader',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          }
        });
        
        const xmlData = response.data;
        
        // Use our specialized parser
        const items = parseGoHighLevelRSS(xmlData);
        
        // Return both the raw data and parsed items
        return res.status(200).json({
          message: `Successfully parsed feed (found ${items.length} items)`,
          status: "success",
          feedUrl,
          rawDataLength: xmlData.length,
          rawDataSample: xmlData.substring(0, 500),
          itemCount: items.length,
          items: items.map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            contentSnippetPreview: item.contentSnippet?.substring(0, 100),
            hasContent: !!item.content,
            contentLength: item.content?.length || 0,
            hasImage: !!item.imageUrl,
            imageUrl: item.imageUrl
          }))
        });
      } catch (error: any) {
        console.error("Error in RSS parser debug:", error);
        
        return res.status(500).json({
          message: "Error parsing RSS feed",
          status: "error",
          error: error.message,
          stack: error.stack,
          feedUrl
        });
      }
    } catch (error: any) {
      console.error("Unexpected error in RSS parser debug:", error);
      res.status(500).json({ 
        message: "Internal server error", 
        error: error.message 
      });
    }
  });
  
  // Admin API endpoints (will need auth middleware later)
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.listContacts();
      res.status(200).json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.listBookings();
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
