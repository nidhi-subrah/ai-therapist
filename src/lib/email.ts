import { Resend } from 'resend';

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn('Resend not configured - skipping welcome email');
    return false;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@aitherapist.com',
      to: [email],
      subject: 'Welcome to AI Therapist! 🧠💙',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to AI Therapist!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your journey to better mental health starts now</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for signing up for AI Therapist! We're excited to have you on board.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #555; line-height: 1.6;">
                <li>💬 Chat with our AI therapist about your feelings</li>
                <li>📊 Track your mood and stress levels</li>
                <li>📈 Monitor your progress over time</li>
                <li>📚 Access helpful resources and insights</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Start Your First Session
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This email was sent to confirm your account creation. 
                If you didn't sign up for AI Therapist, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }

    console.log('Welcome email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  if (!resend) {
    console.warn('Resend not configured - skipping password reset email');
    return false;
  }
  
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@aitherapist.com',
      to: [email],
      subject: 'Reset Your AI Therapist Password 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">We received a request to reset your password</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <p style="color: #555; line-height: 1.6;">
              You requested to reset your password for your AI Therapist account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #777; font-size: 14px;">
              This link will expire in 1 hour for security reasons. 
              If you didn't request a password reset, please ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }

    console.log('Password reset email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
