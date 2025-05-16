import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "../shared/schema";
import { z } from "zod";

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
      
      // In a production environment, you would also:
      // 1. Push to Go High Level CRM (TODO: implement GHL integration)
      // 2. Send confirmation email (TODO: implement SendGrid)
      
      res.status(200).json({ 
        message: "Form submitted successfully", 
        contactId: contact.id 
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
      
      // Save to database
      const booking = await storage.createBooking(bookingData);
      
      // In a production environment, you would also:
      // 1. Schedule in calendar (TODO: implement Calendar integration)
      // 2. Send confirmation email (TODO: implement SendGrid)
      
      res.status(200).json({ 
        message: "Booking created successfully", 
        bookingId: booking.id 
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
