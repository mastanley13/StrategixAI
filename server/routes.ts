import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertBookingSchema } from "../shared/schema";
import { z } from "zod";

// Blog functionality removed
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
