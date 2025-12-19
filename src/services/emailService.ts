/**
 * AGM Store Builder - Email Service
 * Email sending functionality using Nodemailer
 */

import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
}

/**
 * Send email
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${config.email.fromName} <${config.email.fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', { to: options.to, subject: options.subject });
    return true;
  } catch (error: any) {
    logger.error('Failed to send email', {
      to: options.to,
      subject: options.subject,
      error: error.message,
    });
    return false;
  }
}

/**
 * Email Templates
 */

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  fullName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to AGM Store Builder! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName}!</h2>
          <p>Thank you for signing up with AGM Store Builder. We're excited to help you build and grow your online business.</p>
          <p>With AGM Store Builder, you can:</p>
          <ul>
            <li>✅ Create your custom online store in minutes</li>
            <li>✅ Add and manage products easily</li>
            <li>✅ Accept payments seamlessly</li>
            <li>✅ Track orders and analytics</li>
            <li>✅ Get instant payouts to your bank account</li>
          </ul>
          <a href="${config.frontendUrl}/dashboard" class="button">Go to Dashboard</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AGM Store Builder. All rights reserved.</p>
          <p>Visit us at <a href="${config.frontendUrl}">${config.frontendUrl}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to AGM Store Builder! 🎉',
    html,
    text: `Hello ${fullName}! Welcome to AGM Store Builder. Visit ${config.frontendUrl}/dashboard to get started.`,
  });
}

/**
 * Send email OTP
 */
export async function sendEmailOtp(
  email: string,
  code: string,
  purpose: 'signup' | 'login' | 'password_reset' = 'signup'
): Promise<boolean> {
  const purposeText = {
    signup: 'verify your email',
    login: 'log in to your account',
    password_reset: 'reset your password',
  }[purpose];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .otp-box { background: white; border: 2px solid #4F46E5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification Code</h1>
        </div>
        <div class="content">
          <p>You requested to ${purposeText}. Use the code below to continue:</p>
          <div class="otp-box">
            <div class="otp-code">${code}</div>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AGM Store Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Your verification code: ${code}`,
    html,
    text: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  fullName: string
): Promise<boolean> {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .warning { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AGM Store Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
    text: `Hello ${fullName}, Click this link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
  });
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    storeName: string;
  }
): Promise<boolean> {
  const itemsHtml = orderDetails.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        .total-row { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${orderDetails.customerName}!</h2>
          <p>Thank you for your order from <strong>${orderDetails.storeName}</strong>.</p>
          <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
          
          <table class="order-table">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Quantity</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="2" style="padding: 12px; text-align: right;">Total:</td>
                <td style="padding: 12px; text-align: right; color: #10B981;">₦${orderDetails.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <p>Track your order at: <a href="${config.frontendUrl}/orders/${orderDetails.orderNumber}">${config.frontendUrl}/orders/${orderDetails.orderNumber}</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AGM Store Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderDetails.orderNumber}`,
    html,
    text: `Your order ${orderDetails.orderNumber} has been confirmed. Total: ₦${orderDetails.total.toLocaleString()}`,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(
  email: string,
  orderNumber: string,
  customerName: string,
  status: string,
  storeName: string
): Promise<boolean> {
  const statusEmoji = {
    confirmed: '✅',
    fulfilled: '🚚',
    cancelled: '❌',
  }[status] || '📦';

  const statusMessage = {
    confirmed: 'has been confirmed and is being prepared',
    fulfilled: 'has been fulfilled and is on its way',
    cancelled: 'has been cancelled',
  }[status] || 'has been updated';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .status-badge { display: inline-block; padding: 8px 16px; background: #10B981; color: white; border-radius: 20px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusEmoji} Order Status Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${customerName}!</h2>
          <p>Your order <strong>${orderNumber}</strong> from <strong>${storeName}</strong> ${statusMessage}.</p>
          <div class="status-badge">${status.toUpperCase()}</div>
          <p>Track your order: <a href="${config.frontendUrl}/orders/${orderNumber}">View Order Details</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AGM Store Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: `Order Update - ${orderNumber}`,
    html,
    text: `Your order ${orderNumber} ${statusMessage}.`,
  });
}