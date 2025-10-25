// API route for handling contact form submissions
// This file will be deployed as a serverless function on Vercel

// Simple in-memory rate limiting (resets when serverless function cold starts)
const RATE_LIMIT = 10; // maximum 10 requests per IP
const RATE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ipRequestCounts = {}; // stores {ip: {count, timestamp}}

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get client IP for rate limiting
    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "unknown-ip";

    // Check rate limits
    if (!ipRequestCounts[clientIP]) {
      ipRequestCounts[clientIP] = {
        count: 0,
        timestamp: Date.now(),
      };
    } else {
      // Reset count if window has passed
      if (Date.now() - ipRequestCounts[clientIP].timestamp > RATE_WINDOW) {
        ipRequestCounts[clientIP] = {
          count: 0,
          timestamp: Date.now(),
        };
      }
    }

    // Increment request count
    ipRequestCounts[clientIP].count++;

    // Check if too many requests
    if (ipRequestCounts[clientIP].count > RATE_LIMIT) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    // Get form data
    const { user_name, user_email, user_phone, message } = req.body;

    // Validate required fields
    if (!user_email || !message) {
      return res.status(400).json({
        error: "Email and message are required",
      });
    }

    // Prepare email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="margin: 20px 0;">
          <p><strong>Name:</strong> ${user_name || 'Not provided'}</p>
          <p><strong>Email:</strong> <a href="mailto:${user_email}">${user_email}</a></p>
          <p><strong>Phone:</strong> ${user_phone || 'Not provided'}</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h3 style="color: #555; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap; color: #333;">${message}</p>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #888; font-size: 12px;">
          Sent from <a href="https://www.deepanalve.dev">www.deepanalve.dev</a> contact form
        </p>
      </div>
    `;

    // Send email using Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Contact Form <contact@email.deepanalve.dev>",
        to: "deepanalve@gmail.com",
        replyTo: user_email,
        subject: `Portfolio Contact: ${user_name || 'New Message'}`,
        html: emailHtml,
      }),
    });

    // Check if email was sent successfully
    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    const result = await resendResponse.json();

    // Return success
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      emailId: result.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      error: "Error sending email",
      message: error.message,
    });
  }
}
