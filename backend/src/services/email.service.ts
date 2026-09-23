import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // If SMTP environment variables exist, use them, otherwise use ethereal/test transport
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Test mock/console transport
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'mock_user@wildconnect.local',
          pass: 'mock_pass',
        },
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        logger.info(`[EMAIL SIMULATION] To: ${options.to} | Subject: ${options.subject}`);
        return true;
      }

      // Safe sending (does not crash the app)
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"WildConnect" <no-reply@wildconnect.com>',
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>?/gm, ''),
        html: options.html,
      });

      logger.info(`[EMAIL SENT] MessageId: ${info.messageId} to ${options.to}`);
      return true;
    } catch (error) {
      logger.error('[EMAIL ERROR] Failed to send email:', error);
      return false; // graceful failure
    }
  }
}

export const emailService = new EmailService();
