const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Create transporter
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await this.transporter.verify();
        console.log("Email service initialized successfully");
      } else {
        console.log("Email credentials not provided, email service disabled");
      }
    } catch (error) {
      console.error("Email service initialization failed:", error.message);
    }
  }

  async sendEmail({ to, subject, text, html }) {
    if (!this.transporter) {
      throw new Error("Email service not initialized");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@globetrotter.com",
      to,
      subject,
      text,
      html,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Send email error:", error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Welcome to GlobeTrotter!</h1>
        <p>Hi ${user.firstName},</p>
        <p>Welcome to GlobeTrotter! We're excited to help you plan your next adventure.</p>
        <p>Get started by creating your first trip and exploring all the features we have to offer.</p>
        <p>Happy travels!</p>
        <p>The GlobeTrotter Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: "Welcome to GlobeTrotter!",
      html,
      text: `Hi ${user.firstName}, Welcome to GlobeTrotter! We're excited to help you plan your next adventure.`,
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Password Reset Request</h1>
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset for your GlobeTrotter account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>The GlobeTrotter Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: "Password Reset Request - GlobeTrotter",
      html,
      text: `Hi ${user.firstName}, You requested a password reset. Visit: ${resetUrl}`,
    });
  }

  async sendTripInvitation(trip, inviterUser, inviteeEmail) {
    const inviteUrl = `${process.env.CLIENT_URL}/trip/${trip._id}/join`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c5282;">Trip Invitation</h1>
        <p>Hi there!</p>
        <p>${inviterUser.firstName} ${
      inviterUser.lastName
    } has invited you to collaborate on a trip:</p>
        <h2>${trip.name}</h2>
        <p>${trip.description || "No description provided."}</p>
        <p>Click the link below to join the trip:</p>
        <a href="${inviteUrl}" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Trip</a>
        <p>Happy travels!</p>
        <p>The GlobeTrotter Team</p>
      </div>
    `;

    return this.sendEmail({
      to: inviteeEmail,
      subject: `Trip Invitation: ${trip.name}`,
      html,
      text: `${inviterUser.firstName} invited you to join trip: ${trip.name}. Visit: ${inviteUrl}`,
    });
  }
}

module.exports = new EmailService();
