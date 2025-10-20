// Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Brevo API Configuration
const BREVO_CONFIG = {
  apiUrl: 'https://api.brevo.com/v3/smtp/email',
  headers: {
    'accept': 'application/json',
    'api-key': process.env.BREVO_API_KEY,
    'content-type': 'application/json'
  }
};

// Email Subject Mapping (Turkish)
const SUBJECT_MAP = {
  'say-hi': 'Merhaba',
  'join-team': 'Ekibe Katılmak',
  'about-projects': 'Projelerimiz Hakkında',
  'default': 'İletişim'
};

// General API rate limiter (15 minutes window)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact form specific rate limiter (1 hour window)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many contact requests. Please try again in 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'docs')));
app.use('/api/', generalLimiter);

/**
 * Contact form validation rules
 * Validates and sanitizes all input fields
 */
const contactValidationRules = [
  // Contact Type Validation
  body('contactType')
    .trim()
    .isIn(['say-hi', 'join-team', 'about-projects'])
    .withMessage('Invalid contact type'),

  // Full Name Validation
  body('fullName')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\-']+$/).withMessage('Name can only contain letters, spaces, hyphens and apostrophes')
    .customSanitizer(value => validator.escape(value)),

  // Email Validation
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('Email is too long')
    .custom((value) => {
      // Additional email validation
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
      return true;
    }),

  // Message Validation
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10-2000 characters')
    .customSanitizer(value => {
      // Remove HTML tags and dangerous characters
      let sanitized = validator.escape(value);
      // Remove script tags
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      return sanitized;
    }),

  // reCAPTCHA Token (optional validation)
  body('recaptchaToken')
    .optional()
    .trim()
    .isString().withMessage('Invalid reCAPTCHA token')
];

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = validator.stripLow(input);
  
  // Escape HTML entities
  sanitized = validator.escape(sanitized);
  
  // Remove script tags and dangerous patterns
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  return sanitized.trim();
}

/**
 * Get Turkish subject based on contact type
 * @param {string} contactType - Type of contact (say-hi, join-team, about-projects)
 * @returns {string} Turkish subject
 */
function getTurkishSubject(contactType) {
  return SUBJECT_MAP[contactType] || SUBJECT_MAP.default;
}

/**
 * Validate reCAPTCHA token with Google API
 * @param {string} token - reCAPTCHA response token
 * @returns {Promise<boolean>} Validation result
 */
async function validateRecaptcha(token) {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
    return false;
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const response = await axios.post(verifyUrl);
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA validation error:', error.message);
    return false;
  }
}

/**
 * Build email data object for Brevo API
 * @param {Object} formData - Form submission data
 * @param {string} subject - Email subject
 * @returns {Object} Email data object
 */
function buildEmailData(formData, subject) {
  const { fullName, email, message, contactType } = formData;

  return {
    sender: {
      name: "Civilex.AI",
      email: process.env.EMAIL_USER
    },
    to: [{
      email: process.env.MAILTO,
      name: "Civilex Team"
    }],
    replyTo: {
      email: email,
      name: fullName
    },
    subject: `${subject} - ${fullName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          ${subject} İletişim Talebi
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>👤 Gönderen:</strong> ${fullName}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>📋 Konu:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #555; margin-top: 0;">📝 Mesaj İçeriği:</h3>
          <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Bu mesaj ${contactType} kategorisinden PilatesAI Web sitesi üzerinden gönderilmiştir.
          </p>
        </div>
      </div>
    `
  };
}

/**
 * Send email via Brevo API
 * @param {Object} emailData - Email data object
 * @returns {Promise<Object>} Brevo API response
 */
async function sendEmail(emailData) {
  return await axios.post(BREVO_CONFIG.apiUrl, emailData, {
    headers: BREVO_CONFIG.headers
  });
}

/**
 * Contact Form Endpoint
 * POST /api/contact
 * Rate Limited: 3 requests per hour
 * Input Validated & Sanitized
 */
app.post('/api/contact', contactLimiter, contactValidationRules, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    // Get and sanitize validated data
    let { contactType, fullName, email, message, recaptchaToken } = req.body;
    
    // Extra sanitization layer (defense in depth)
    fullName = sanitizeInput(fullName);
    message = sanitizeInput(message);
    email = email.toLowerCase().trim();

    // Validate reCAPTCHA if enabled
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const isValidRecaptcha = await validateRecaptcha(recaptchaToken);
      
      if (!isValidRecaptcha) {
        return res.status(400).json({
          success: false,
          message: 'reCAPTCHA verification failed. Please try again.'
        });
      }
    }

    // Get Turkish subject
    const turkishSubject = getTurkishSubject(contactType);

    // Build and send email
    const emailData = buildEmailData(
      { fullName, email, message, contactType },
      turkishSubject
    );
    
    await sendEmail(emailData);

    // Success response
    return res.json({
      success: true,
      message: 'Your message has been sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error.message);

    // Determine error message
    let errorMessage = 'An error occurred while sending the email. Please try again.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Email service authorization error.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Email format error.';
    }

    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
});

/**
 * Health Check Endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Home Page Route
 * GET /
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Civilex.AI Server running on port ${PORT}`);
});

module.exports = app;
