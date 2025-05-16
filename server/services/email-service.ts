import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will be disabled.');
}

/**
 * Email template types
 */
export enum EmailTemplate {
  CONTACT_SUBMISSION = 'contact_submission',
  BOOKING_CONFIRMATION = 'booking_confirmation',
  INTERNAL_NOTIFICATION = 'internal_notification',
}

/**
 * Email data interface
 */
interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Contact submission data
 */
interface ContactSubmissionData {
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  source?: string | null;
}

/**
 * Booking data
 */
interface BookingData {
  name: string;
  email: string;
  date: Date;
  service?: string | null;
  notes?: string | null;
}

/**
 * Send email using SendGrid
 * @param emailData Email data to send
 * @returns Promise resolving to API response
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('Email sending disabled: No SendGrid API key provided');
    return false;
  }

  try {
    await sgMail.send(emailData);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a contact form submission confirmation email
 * @param data Contact submission data
 * @returns Promise resolving to boolean indicating success
 */
export async function sendContactConfirmation(data: ContactSubmissionData): Promise<boolean> {
  const { name, email } = data;
  
  const emailData: EmailData = {
    to: email,
    from: 'noreply@strategixai.co', // Replace with your verified SendGrid sender
    subject: 'Thank you for contacting StrategixAI',
    text: `Hi ${name},\n\nThank you for contacting StrategixAI. Our team will review your inquiry and get back to you as soon as possible.\n\nBest regards,\nThe StrategixAI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Thank you for contacting StrategixAI</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to us. Our team will review your inquiry and get back to you as soon as possible.</p>
        <p>Best regards,<br />The StrategixAI Team</p>
      </div>
    `,
  };

  return sendEmail(emailData);
}

/**
 * Send a booking confirmation email
 * @param data Booking data
 * @returns Promise resolving to boolean indicating success
 */
export async function sendBookingConfirmation(data: BookingData): Promise<boolean> {
  const { name, email, date, service } = data;
  
  const formattedDate = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const emailData: EmailData = {
    to: email,
    from: 'noreply@strategixai.co', // Replace with your verified SendGrid sender
    subject: 'Your StrategixAI Appointment Confirmation',
    text: `Hi ${name},\n\nThank you for scheduling a ${service || 'consultation'} with StrategixAI for ${formattedDate}. We look forward to speaking with you.\n\nBest regards,\nThe StrategixAI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Your Appointment is Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Thank you for scheduling a ${service || 'consultation'} with StrategixAI.</p>
        <p><strong>Date and Time:</strong> ${formattedDate}</p>
        <p>We look forward to speaking with you. Please add this appointment to your calendar.</p>
        <p>Best regards,<br />The StrategixAI Team</p>
      </div>
    `,
  };

  return sendEmail(emailData);
}

/**
 * Send an internal notification email for new submissions
 * @param type The type of notification (contact or booking)
 * @param data The submission data
 * @returns Promise resolving to boolean indicating success
 */
export async function sendInternalNotification(
  type: 'contact' | 'booking',
  data: ContactSubmissionData | BookingData
): Promise<boolean> {
  // Internal notification recipient(s)
  const internalEmail = 'team@strategixai.co'; // Replace with your actual internal email
  
  let subject = '';
  let text = '';
  let html = '';
  
  if (type === 'contact') {
    const contactData = data as ContactSubmissionData;
    subject = 'New Contact Form Submission';
    text = `Name: ${contactData.name}\nEmail: ${contactData.email}\nCompany: ${contactData.company || 'N/A'}\nMessage: ${contactData.message || 'N/A'}\nSource: ${contactData.source || 'Website'}`;
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
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.company || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.message || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Source:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contactData.source || 'Website'}</td>
          </tr>
        </table>
      </div>
    `;
  } else if (type === 'booking') {
    const bookingData = data as BookingData;
    const formattedDate = bookingData.date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    subject = 'New Booking Request';
    text = `Name: ${bookingData.name}\nEmail: ${bookingData.email}\nDate: ${formattedDate}\nService: ${bookingData.service || 'N/A'}\nNotes: ${bookingData.notes || 'N/A'}`;
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
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingData.service || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Notes:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${bookingData.notes || 'N/A'}</td>
          </tr>
        </table>
      </div>
    `;
  }
  
  const emailData: EmailData = {
    to: internalEmail,
    from: 'noreply@strategixai.co', // Replace with your verified SendGrid sender
    subject,
    text,
    html,
  };

  return sendEmail(emailData);
} 