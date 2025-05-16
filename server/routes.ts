import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, company, message } = req.body;
      
      // Basic validation
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      // Log the submission (would typically save to database and/or send email)
      console.log("Contact form submission:", { name, email, company, message });
      
      // In a production environment, you would:
      // 1. Save to database
      // 2. Send confirmation email
      // 3. Notify staff
      
      res.status(200).json({ message: "Contact form submitted successfully" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
