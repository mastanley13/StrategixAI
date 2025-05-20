import { NextRequest, NextResponse } from 'next/server';

// Set edge runtime for better performance
export const runtime = 'edge';

// Form validation 
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message?: string;
}

function validateFormData(data: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  if (!data) {
    return { valid: false, errors: ['Missing form data'] };
  }
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    errors.push('Email is required');
  } else {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }
  
  // Optional fields validation
  if (data.company && typeof data.company !== 'string') {
    errors.push('Company must be a string');
  }
  
  if (data.message && typeof data.message !== 'string') {
    errors.push('Message must be a string');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * POST handler for the contact form
 * Proxies submission to Go High Level form
 */
export async function POST(request: NextRequest) {
  try {
    // Get the GHL form URL from environment variables
    const GHL_FORM_URL = process.env.GHL_FORM_URL;
    
    if (!GHL_FORM_URL) {
      return NextResponse.json(
        { success: false, message: 'Form submission URL not configured' },
        { status: 500 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Validate the form data
    const validation = validateFormData(data);
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid form data', errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Prepare data for GHL
    const formData = {
      name: data.name,
      email: data.email,
      company: data.company || '',
      message: data.message || '',
      source: 'Website Contact Form',
      locationId: process.env.GHL_LOCATION_ID || '',
      // Add any other required GHL fields here
    };
    
    // Send the data to GHL
    const response = await fetch(GHL_FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    // Check if the submission was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error submitting to GHL:', errorText);
      
      return NextResponse.json(
        { success: false, message: 'Failed to submit form' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    });
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 