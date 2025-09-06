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

    // Load EmailJS SDK
    const { default: emailjs } = await import("@emailjs/browser");

    // Send email using EmailJS with environment variables
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        user_name,
        user_email,
        user_phone,
        message,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        // If you have a private key (for paid plans):
        // privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );

    // Return success
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      error: "Error sending email",
      message: error.message,
    });
  }
}
