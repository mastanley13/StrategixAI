import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, contacts, bookings, blogPosts } from '../shared/schema';
import { eq } from 'drizzle-orm';
import type { User, InsertUser, Contact, InsertContact, Booking, InsertBooking, BlogPost } from '../shared/schema';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// For production, we require a real DATABASE_URL
if (!isDev && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize Neon HTTP client and Drizzle ORM (only in production)
let db: any;
if (!isDev && process.env.DATABASE_URL) {
  const client = neon(process.env.DATABASE_URL);
  db = drizzle(client);
}

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  listContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  listBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  
  // Blog post methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  listBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<Omit<BlogPost, 'id'>>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  /**
   * Get a contact by ID
   * @param id Contact ID
   * @returns Contact or null if not found
   */
  getContactById(id: number): Promise<Contact | null>;
}

// Mock implementation for development
export class MockStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private blogPosts: Map<number, BlogPost> = new Map();
  private userCounter = 1;
  private contactCounter = 1;
  private bookingCounter = 1;
  private blogPostCounter = 1;

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const newUser = { 
      ...user, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as User;
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }
  
  async listContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
  
  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.contactCounter++;
    const newContact = { 
      ...contact, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as Contact;
    this.contacts.set(id, newContact);
    return newContact;
  }
  
  async updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined> {
    const existingContact = this.contacts.get(id);
    if (!existingContact) return undefined;
    
    const updatedContact = { 
      ...existingContact, 
      ...contact, 
      updatedAt: new Date() 
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
  
  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async listBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingCounter++;
    const newBooking = { 
      ...booking, 
      id, 
      status: 'pending', 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as Booking;
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const existingBooking = this.bookings.get(id);
    if (!existingBooking) return undefined;
    
    const updatedBooking = { 
      ...existingBooking, 
      ...booking, 
      updatedAt: new Date() 
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // Blog post methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }
  
  async listBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const id = this.blogPostCounter++;
    const newBlogPost = { ...blogPost, id } as BlogPost;
    this.blogPosts.set(id, newBlogPost);
    return newBlogPost;
  }
  
  async updateBlogPost(id: number, blogPost: Partial<Omit<BlogPost, 'id'>>): Promise<BlogPost | undefined> {
    const existingBlogPost = this.blogPosts.get(id);
    if (!existingBlogPost) return undefined;
    
    const updatedBlogPost = { ...existingBlogPost, ...blogPost, lastFetched: new Date() };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    if (!this.blogPosts.has(id)) return false;
    return this.blogPosts.delete(id);
  }

  /**
   * Get a contact by ID
   * @param id Contact ID
   * @returns Contact or null if not found
   */
  async getContactById(id: number): Promise<Contact | null> {
    return this.contacts.get(id) || null;
  }
}

// Implementation with Drizzle ORM for production
export class DrizzleStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }
  
  async listContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }
  
  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }
  
  async updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined> {
    const result = await db.update(contacts)
      .set({ ...contact, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return result[0];
  }
  
  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }
  
  async listBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(bookings.date);
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }
  
  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const result = await db.update(bookings)
      .set({ ...booking, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return result[0];
  }
  
  // Blog post methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }
  
  async listBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.publishedAt);
  }
  
  async createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(blogPost).returning();
    return result[0];
  }
  
  async updateBlogPost(id: number, blogPost: Partial<Omit<BlogPost, 'id'>>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({ ...blogPost, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      const result = await db.delete(blogPosts)
        .where(eq(blogPosts.id, id))
        .returning();
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
  async getContactById(id: number): Promise<Contact | null> {
    try {
      const result = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, id))
        .limit(1);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting contact by ID:", error);
      throw error;
    }
  }
}

// Export singleton instance based on environment
export const storage: IStorage = isDev ? new MockStorage() : new DrizzleStorage();
