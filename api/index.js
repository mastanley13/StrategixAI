// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message"),
  source: text("source"),
  ghlContactId: text("ghl_contact_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id),
  service: text("service").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  ghlId: text("ghl_id").notNull().unique(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author"),
  publishedAt: timestamp("published_at"),
  imageUrl: text("image_url"),
  tags: jsonb("tags"),
  lastFetched: timestamp("last_fetched").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  company: true,
  message: true,
  source: true
});
var insertBookingSchema = createInsertSchema(bookings).pick({
  contactId: true,
  service: true,
  date: true,
  notes: true
});

// server/storage.ts
import { eq } from "drizzle-orm";
var isDev = process.env.NODE_ENV === "development";
if (!isDev && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}
var db;
if (!isDev && process.env.DATABASE_URL) {
  const client = neon(process.env.DATABASE_URL);
  db = drizzle(client);
}
var MockStorage = class {
  users = /* @__PURE__ */ new Map();
  contacts = /* @__PURE__ */ new Map();
  bookings = /* @__PURE__ */ new Map();
  blogPosts = /* @__PURE__ */ new Map();
  userCounter = 1;
  contactCounter = 1;
  bookingCounter = 1;
  blogPostCounter = 1;
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(user) {
    const id = this.userCounter++;
    const newUser = {
      ...user,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }
  // Contact methods
  async getContact(id) {
    return this.contacts.get(id);
  }
  async listContacts() {
    return Array.from(this.contacts.values());
  }
  async createContact(contact) {
    const id = this.contactCounter++;
    const newContact = {
      ...contact,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.contacts.set(id, newContact);
    return newContact;
  }
  async updateContact(id, contact) {
    const existingContact = this.contacts.get(id);
    if (!existingContact) return void 0;
    const updatedContact = {
      ...existingContact,
      ...contact,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
  // Booking methods
  async getBooking(id) {
    return this.bookings.get(id);
  }
  async listBookings() {
    return Array.from(this.bookings.values());
  }
  async createBooking(booking) {
    const id = this.bookingCounter++;
    const newBooking = {
      ...booking,
      id,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  async updateBooking(id, booking) {
    const existingBooking = this.bookings.get(id);
    if (!existingBooking) return void 0;
    const updatedBooking = {
      ...existingBooking,
      ...booking,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  // Blog post methods
  async getBlogPost(id) {
    return this.blogPosts.get(id);
  }
  async getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find((post) => post.slug === slug);
  }
  async listBlogPosts() {
    return Array.from(this.blogPosts.values());
  }
  async createBlogPost(blogPost) {
    const id = this.blogPostCounter++;
    const newBlogPost = { ...blogPost, id };
    this.blogPosts.set(id, newBlogPost);
    return newBlogPost;
  }
  async updateBlogPost(id, blogPost) {
    const existingBlogPost = this.blogPosts.get(id);
    if (!existingBlogPost) return void 0;
    const updatedBlogPost = { ...existingBlogPost, ...blogPost, lastFetched: /* @__PURE__ */ new Date() };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }
  async deleteBlogPost(id) {
    if (!this.blogPosts.has(id)) return false;
    return this.blogPosts.delete(id);
  }
  /**
   * Get a contact by ID
   * @param id Contact ID
   * @returns Contact or null if not found
   */
  async getContactById(id) {
    return this.contacts.get(id) || null;
  }
};
var DrizzleStorage = class {
  // User methods
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  async createUser(user) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  // Contact methods
  async getContact(id) {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }
  async listContacts() {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }
  async createContact(contact) {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }
  async updateContact(id, contact) {
    const result = await db.update(contacts).set({ ...contact, updatedAt: /* @__PURE__ */ new Date() }).where(eq(contacts.id, id)).returning();
    return result[0];
  }
  // Booking methods
  async getBooking(id) {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }
  async listBookings() {
    return await db.select().from(bookings).orderBy(bookings.date);
  }
  async createBooking(booking) {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }
  async updateBooking(id, booking) {
    const result = await db.update(bookings).set({ ...booking, updatedAt: /* @__PURE__ */ new Date() }).where(eq(bookings.id, id)).returning();
    return result[0];
  }
  // Blog post methods
  async getBlogPost(id) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }
  async getBlogPostBySlug(slug) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }
  async listBlogPosts() {
    return await db.select().from(blogPosts).orderBy(blogPosts.publishedAt);
  }
  async createBlogPost(blogPost) {
    const result = await db.insert(blogPosts).values(blogPost).returning();
    return result[0];
  }
  async updateBlogPost(id, blogPost) {
    const result = await db.update(blogPosts).set({ ...blogPost, updatedAt: /* @__PURE__ */ new Date() }).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }
  async deleteBlogPost(id) {
    try {
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting blog post ${id}:`, error);
      return false;
    }
  }
  /**
   * Get a contact by ID
   * @param id Contact ID
   * @returns Contact or null if not found
   */
  async getContactById(id) {
    try {
      const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting contact by ID:", error);
      throw error;
    }
  }
};
var storage = isDev ? new MockStorage() : new DrizzleStorage();

// server/routes.ts
import axios2 from "axios";

// server/services/rss-service.ts
import Parser from "rss-parser";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import axios from "axios";
var isDev2 = process.env.NODE_ENV === "development";
var window = new JSDOM("").window;
var purify = DOMPurify(window);
var parser = new Parser({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["content:encoded", "content:encoded"],
      ["dc:creator", "dc:creator"]
    ]
  }
});
var getRssFeedUrl = () => {
  const url = process.env.RSS_FEED_URL;
  if (!url) return null;
  try {
    console.log("Original RSS feed URL:", url);
    if (url.includes("&") && !url.includes("%26")) {
      const parts = url.split("?");
      if (parts.length > 1) {
        const baseUrl = parts[0];
        const params = new URLSearchParams(parts[1]);
        const encodedUrl = baseUrl + "?" + params.toString();
        console.log("Encoded RSS feed URL:", encodedUrl);
        return encodedUrl;
      }
    }
    return url;
  } catch (error) {
    console.error("Error processing RSS feed URL:", error);
    return url;
  }
};
var RSS_FEED_URL = getRssFeedUrl();
function parseGoHighLevelRSS(xmlData) {
  console.log("Parsing Go High Level RSS feed...");
  const isGHL = xmlData.includes("StrategixAI") || xmlData.includes("Go High Level");
  console.log("Is likely a Go High Level feed:", isGHL);
  const items = [];
  try {
    const channelMatch = /<channel>([\s\S]*?)<\/channel>/i.exec(xmlData);
    if (!channelMatch) {
      console.error("No channel tag found in RSS feed");
      return [];
    }
    const channelContent = channelMatch[1];
    console.log("Channel content length:", channelContent.length);
    const siteTitle = extractXmlTag(channelContent, "title") || "Unknown Site";
    console.log("Site title:", siteTitle);
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    let itemCount = 0;
    while ((match = itemRegex.exec(channelContent)) !== null) {
      itemCount++;
      const itemXml = match[1];
      console.log(`Found item ${itemCount}, content length: ${itemXml.length}`);
      try {
        const title = extractXmlTag(itemXml, "title");
        if (!title) {
          console.warn(`Item ${itemCount} has no title, skipping`);
          continue;
        }
        const link = extractXmlTag(itemXml, "link") || "";
        const pubDate = extractXmlTag(itemXml, "pubDate") || "";
        let content = extractXmlTag(itemXml, "content:encoded") || extractXmlTag(itemXml, "description") || "";
        let imageUrl = "";
        const mediaContent = extractXmlTag(itemXml, "media:content", true);
        if (mediaContent) {
          const urlMatch = /url="([^"]+)"/i.exec(mediaContent);
          if (urlMatch && urlMatch[1]) {
            imageUrl = urlMatch[1];
            console.log(`Found image URL in media:content: ${imageUrl.substring(0, 50)}`);
          }
        }
        if (!imageUrl && content && content.includes("<img")) {
          const imgSrcMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(content);
          if (imgSrcMatch && imgSrcMatch[1]) {
            imageUrl = imgSrcMatch[1];
            console.log(`Found image URL in content: ${imageUrl.substring(0, 50)}`);
          }
        }
        let excerpt = "";
        if (content) {
          excerpt = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 200);
          if (excerpt.length === 200) {
            excerpt += "...";
          }
        }
        items.push({
          title,
          link,
          pubDate,
          content,
          contentSnippet: excerpt,
          imageUrl,
          // Generate a unique ID from title
          guid: link || `ghl-post-${Date.now()}-${itemCount}`,
          categories: []
          // Go High Level posts might not have categories
        });
        console.log(`Successfully parsed item: "${title}"`);
      } catch (itemError) {
        console.error(`Error parsing item ${itemCount}:`, itemError.message);
      }
    }
    console.log(`Completed parsing ${itemCount} items, successfully extracted ${items.length} posts`);
    return items;
  } catch (error) {
    console.error("Error in parseGoHighLevelRSS:", error.message);
    return [];
  }
}
function extractXmlTag(xml, tagName, includeTag = false) {
  if (!xml || !tagName) return null;
  let regex;
  if (includeTag) {
    regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "s");
    const match = regex.exec(xml);
    if (match) {
      return `<${tagName}${match[0].split("<")[1].split(">")[0].slice(tagName.length)}>${match[1]}</${tagName}>`;
    }
  } else {
    regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "s");
    const match = regex.exec(xml);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// server/services/blogSync.ts
import Parser2 from "rss-parser";
import DOMPurify2 from "dompurify";
import { JSDOM as JSDOM2 } from "jsdom";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/services/blogSync.ts
var window2 = new JSDOM2("").window;
var purify2 = DOMPurify2(window2);
var parser2 = new Parser2({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["content:encoded", "content:encoded"],
      ["dc:creator", "creator"]
    ]
  }
});
async function fetchRssFeed() {
  const url = process.env.RSS_FEED_URL;
  if (!url) {
    throw new Error("RSS_FEED_URL is not defined in environment variables");
  }
  try {
    log(`Fetching RSS feed from: ${url}`);
    const feed = await parser2.parseURL(url);
    log(`Found ${feed.items.length} items in the RSS feed`);
    return feed.items;
  } catch (error) {
    log(`Error fetching RSS feed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
function convertRssItemToBlogPost(item) {
  const ghlId = item.guid || item.link?.split("/").pop() || `ghl-${Buffer.from(item.title || "untitled").toString("base64")}`;
  const title = item.title || "Untitled Post";
  const slug = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  const content = item["content:encoded"] || item.content || "";
  const excerpt = item.contentSnippet || (content ? content.replace(/<[^>]+>/g, " ").trim().substring(0, 200) + "..." : "No excerpt available");
  let imageUrl = "";
  if (item["media:content"] && item["media:content"][0] && item["media:content"][0].$) {
    imageUrl = item["media:content"][0].$.url;
  }
  if (!imageUrl && content) {
    const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(content);
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1];
    }
  }
  const publishedAt = item.pubDate ? new Date(item.pubDate) : /* @__PURE__ */ new Date();
  const tags = item.categories || [];
  return {
    ghlId,
    title,
    slug,
    content: purify2.sanitize(content),
    excerpt,
    author: item.creator || "StrategixAI",
    publishedAt,
    imageUrl,
    tags,
    lastFetched: /* @__PURE__ */ new Date()
  };
}
async function syncBlogPosts(forceUpdate = false) {
  try {
    const rssItems = await fetchRssFeed();
    let importedCount = 0;
    let updatedCount = 0;
    for (const item of rssItems) {
      try {
        if (!item.title) {
          log("Skipping RSS item without title");
          continue;
        }
        const blogPost = convertRssItemToBlogPost(item);
        const existingPost = await storage.getBlogPostBySlug(blogPost.slug);
        if (!existingPost) {
          await storage.createBlogPost(blogPost);
          log(`Imported new blog post: "${blogPost.title}"`);
          importedCount++;
        } else if (forceUpdate) {
          await storage.updateBlogPost(existingPost.id, {
            title: blogPost.title,
            content: blogPost.content,
            excerpt: blogPost.excerpt,
            author: blogPost.author,
            publishedAt: blogPost.publishedAt,
            imageUrl: blogPost.imageUrl,
            tags: blogPost.tags,
            lastFetched: /* @__PURE__ */ new Date()
          });
          log(`Updated existing blog post: "${blogPost.title}"`);
          updatedCount++;
        } else {
          log(`Blog post "${blogPost.title}" already exists, skipping`);
        }
      } catch (error) {
        console.error(`Error processing RSS item "${item.title || "unknown"}":`, error);
      }
    }
    log(`Blog sync complete. Imported ${importedCount} new posts, updated ${updatedCount} existing posts from ${rssItems.length} RSS items`);
    return { imported: importedCount, updated: updatedCount };
  } catch (error) {
    console.error("Blog sync failed:", error);
    throw error;
  }
}
async function getBlogSummary() {
  const posts = await storage.listBlogPosts();
  return {
    count: posts.length,
    titles: posts.map((post) => post.title),
    ids: posts.map((post) => post.id)
  };
}
async function deleteBlogPost(id) {
  try {
    await storage.deleteBlogPost(id);
    return true;
  } catch (error) {
    console.error(`Error deleting blog post ID ${id}:`, error);
    return false;
  }
}

// server/services/email-service.ts
import sgMail from "@sendgrid/mail";
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SENDGRID_API_KEY is not set. Email functionality will be disabled.");
}
async function sendEmail(emailData) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Email sending disabled: No SendGrid API key provided");
    return false;
  }
  try {
    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
async function sendContactConfirmation(data) {
  const { name, email } = data;
  const emailData = {
    to: email,
    from: "noreply@strategixai.co",
    // Replace with your verified SendGrid sender
    subject: "Thank you for contacting StrategixAI",
    text: `Hi ${name},

Thank you for contacting StrategixAI. Our team will review your inquiry and get back to you as soon as possible.

Best regards,
The StrategixAI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Thank you for contacting StrategixAI</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to us. Our team will review your inquiry and get back to you as soon as possible.</p>
        <p>Best regards,<br />The StrategixAI Team</p>
      </div>
    `
  };
  return sendEmail(emailData);
}
async function sendBookingConfirmation(data) {
  const { name, email, date, service } = data;
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const emailData = {
    to: email,
    from: "noreply@strategixai.co",
    // Replace with your verified SendGrid sender
    subject: "Your StrategixAI Appointment Confirmation",
    text: `Hi ${name},

Thank you for scheduling a ${service || "consultation"} with StrategixAI for ${formattedDate}. We look forward to speaking with you.

Best regards,
The StrategixAI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Your Appointment is Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Thank you for scheduling a ${service || "consultation"} with StrategixAI.</p>
        <p><strong>Date and Time:</strong> ${formattedDate}</p>
        <p>We look forward to speaking with you. Please add this appointment to your calendar.</p>
        <p>Best regards,<br />The StrategixAI Team</p>
      </div>
    `
  };
  return sendEmail(emailData);
}
async function sendInternalNotification(type, data) {
  const internalEmail = "team@strategixai.co";
  let subject = "";
  let text2 = "";
  let html = "";
  if (type === "contact") {
    const contactData = data;
    subject = "New Contact Form Submission";
    text2 = `Name: ${contactData.name}
Email: ${contactData.email}
Company: ${contactData.company || "N/A"}
Message: ${contactData.message || "N/A"}
Source: ${contactData.source || "Website"}`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Company:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.company || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.message || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Source:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.source || "Website"}</td>
          </tr>
        </table>
      </div>
    `;
  } else if (type === "booking") {
    const bookingData = data;
    const formattedDate = bookingData.date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    subject = "New Booking Request";
    text2 = `Name: ${bookingData.name}
Email: ${bookingData.email}
Date: ${formattedDate}
Service: ${bookingData.service || "N/A"}
Notes: ${bookingData.notes || "N/A"}`;
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">New Booking Request</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date & Time:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Service:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingData.service || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Notes:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingData.notes || "N/A"}</td>
          </tr>
        </table>
      </div>
    `;
  }
  const emailData = {
    to: internalEmail,
    from: "noreply@strategixai.co",
    // Replace with your verified SendGrid sender
    subject,
    text: text2,
    html
  };
  return sendEmail(emailData);
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/intake", async (req, res) => {
    try {
      const validationResult = insertContactSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid form data",
          errors: validationResult.error.errors
        });
      }
      const contactData = validationResult.data;
      const contact = await storage.createContact(contactData);
      const userEmailSent = await sendContactConfirmation({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        message: contactData.message,
        source: contactData.source
      });
      const internalEmailSent = await sendInternalNotification("contact", {
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        message: contactData.message,
        source: contactData.source
      });
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
  app2.post("/api/book", async (req, res) => {
    try {
      const validationResult = insertBookingSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid booking data",
          errors: validationResult.error.errors
        });
      }
      const bookingData = validationResult.data;
      let contactName = "";
      let contactEmail = "";
      if (bookingData.contactId) {
        const contact = await storage.getContactById(bookingData.contactId);
        if (contact) {
          contactName = contact.name;
          contactEmail = contact.email;
        }
      }
      if (!contactName || !contactEmail) {
        contactName = req.body.name || "Customer";
        contactEmail = req.body.email;
        if (!contactEmail) {
          return res.status(400).json({
            message: "Email is required for booking confirmation",
            errors: ["Email is required"]
          });
        }
      }
      const booking = await storage.createBooking(bookingData);
      const userEmailSent = await sendBookingConfirmation({
        name: contactName,
        email: contactEmail,
        date: bookingData.date,
        service: bookingData.service,
        notes: bookingData.notes
      });
      const internalEmailSent = await sendInternalNotification("booking", {
        name: contactName,
        email: contactEmail,
        date: bookingData.date,
        service: bookingData.service,
        notes: bookingData.notes
      });
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
  app2.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.listBlogPosts();
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/blog/:slug", async (req, res) => {
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
  app2.post("/api/blog/sync", async (req, res) => {
    try {
      const forceUpdate = req.query.forceUpdate === "true" || req.body.forceUpdate === true;
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
  app2.get("/api/blog/summary", async (req, res) => {
    try {
      const summary = await getBlogSummary();
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error getting blog summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/blog/:id", async (req, res) => {
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
  app2.get("/api/debug/rss", async (req, res) => {
    try {
      const feedUrl = process.env.RSS_FEED_URL;
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
      console.log(`Debug: Trying to access RSS feed at ${feedUrl}`);
      try {
        const response = await axios2.get(feedUrl, {
          timeout: 1e4,
          headers: {
            "User-Agent": "StrategixAI/1.0 RSS-Reader",
            "Accept": "application/rss+xml, application/xml, text/xml, */*"
          }
        });
        const xmlData = response.data;
        const itemCount = (xmlData.match(/<item>/g) || []).length;
        console.log(`Found ${itemCount} <item> tags in XML`);
        const hasTitleTag = xmlData.includes("<title>");
        const hasChannelTag = xmlData.includes("<channel>");
        const hasItemTags = xmlData.includes("<item>");
        const hasContentEncoded = xmlData.includes("<content:encoded>");
        return res.status(200).json({
          message: "RSS feed fetched successfully",
          status: "success",
          statusCode: response.status,
          contentType: response.headers["content-type"],
          dataSnippet: response.data.substring(0, 1e3),
          feedAnalysis: {
            totalLength: response.data.length,
            itemCount,
            hasTitleTag,
            hasChannelTag,
            hasItemTags,
            hasContentEncoded
          },
          feedUrl
        });
      } catch (error) {
        console.error("Detailed error in debug route:", error);
        return res.status(500).json({
          message: "Error fetching RSS feed",
          status: "error",
          error: error.message,
          response: error.response ? {
            status: error.response.status,
            headers: error.response.headers,
            data: typeof error.response.data === "string" ? error.response.data.substring(0, 200) : JSON.stringify(error.response.data).substring(0, 200)
          } : null,
          feedUrl
        });
      }
    } catch (error) {
      console.error("Unexpected error in debug route:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  });
  app2.get("/api/debug/rss-parser", async (req, res) => {
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
        const response = await axios2.get(feedUrl, {
          timeout: 15e3,
          headers: {
            "User-Agent": "StrategixAI/1.0 RSS-Reader",
            "Accept": "application/rss+xml, application/xml, text/xml, */*"
          }
        });
        const xmlData = response.data;
        const items = parseGoHighLevelRSS(xmlData);
        return res.status(200).json({
          message: `Successfully parsed feed (found ${items.length} items)`,
          status: "success",
          feedUrl,
          rawDataLength: xmlData.length,
          rawDataSample: xmlData.substring(0, 500),
          itemCount: items.length,
          items: items.map((item) => ({
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
      } catch (error) {
        console.error("Error in RSS parser debug:", error);
        return res.status(500).json({
          message: "Error parsing RSS feed",
          status: "error",
          error: error.message,
          stack: error.stack,
          feedUrl
        });
      }
    } catch (error) {
      console.error("Unexpected error in RSS parser debug:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  });
  app2.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.listContacts();
      res.status(200).json(contacts2);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.listBookings();
      res.status(200).json(bookings2);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
process.env.RSS_FEED_URL = "https://rss-link.com/feed/8lQAYS7QatKYV3ENYdl1?blogId=RSSaObImCNRCNM3nndyO&limit=25&loadContent=true";
log("Forced setting RSS_FEED_URL to Go High Level feed URL with loadContent=true");
if (!process.env.RSS_FEED_URL) {
  log("\x1B[33mWARNING: RSS_FEED_URL is not set in .env.local. Blog functionality will use mock data.\x1B[0m");
  log('Create a .env.local file with RSS_FEED_URL="your-go-high-level-rss-url" to fix this.');
  if (process.env.NODE_ENV === "development") {
    process.env.RSS_FEED_URL = "https://example.com/mock-feed";
    log("Mock RSS feed URL set for development.");
  }
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  log(`Environment: ${process.env.NODE_ENV || "development"}`);
  log(`RSS Feed configured: ${!!process.env.RSS_FEED_URL}`);
  try {
    const result = await syncBlogPosts(true);
    log(`Initial blog sync complete. Imported ${result.imported} posts, updated ${result.updated} posts.`);
  } catch (error) {
    log("Error during initial blog sync:", error.message);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") !== "development" || process.env.FETCH_RSS === "true") {
    try {
      const intervalMinutes = 60;
      const interval = intervalMinutes * 60 * 1e3;
      log(`Scheduling blog sync every ${intervalMinutes} minutes`);
      setInterval(async () => {
        try {
          const result = await syncBlogPosts(true);
          log(`Scheduled blog sync complete. Imported ${result.imported} posts, updated ${result.updated} posts.`);
        } catch (syncError) {
          log("Error during scheduled blog sync:", syncError.message);
        }
      }, interval);
    } catch (error) {
      log("Error setting up blog sync schedule:", error.message);
    }
  }
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
