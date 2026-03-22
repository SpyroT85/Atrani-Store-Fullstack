const { BrevoClient } = require('@getbrevo/brevo');

const emailApi = new BrevoClient({
  apiKey: process.env.BREVO_SMTP_KEY,
});

async function sendVerificationEmail(email, name, token) {
  console.log('📧 Sending email to:', email);
  const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify?token=${token}`;

  try {
    await emailApi.transactionalEmails.sendTransacEmail({
      sender: { name: 'Atrani Watches', email: process.env.FROM_EMAIL },
      to: [{ email, name }],
      subject: 'Verify your Atrani account',
      htmlContent: `
        <div style="font-family: Manrope, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
          <div style="background: #1a1a1a; padding: 32px 40px;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a37a41;">ATRANI</h1>
            <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #666;">Watches & Fine Writing</p>
          </div>
          <div style="padding: 48px 40px;">
            <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Verify your email address</h2>
            <p style="margin: 0 0 12px; font-size: 15px; color: #555; line-height: 1.6;">Hi ${name},</p>
            <p style="margin: 0 0 32px; font-size: 15px; color: #555; line-height: 1.6;">Thank you for creating an account with Atrani. Please verify your email address to activate your account.</p>
            <div style="text-align: center; margin: 0 0 40px;">
              <a href="${verifyUrl}" style="display: inline-block; padding: 16px 40px; background: #a37a41; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">
                Verify Email Address
              </a>
            </div>
            <p style="margin: 0; font-size: 12px; color: #bbb; line-height: 1.6;">If you didn't create an account with Atrani, you can safely ignore this email. This link will expire in 24 hours.</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px 40px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">© 2025 Atrani Watches. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log('✅ Email sent to:', email);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
}

async function sendPasswordResetEmail(email, name, token) {
  console.log('📧 Sending password reset to:', email);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await emailApi.transactionalEmails.sendTransacEmail({
      sender: { name: 'Atrani Watches', email: process.env.FROM_EMAIL },
      to: [{ email, name }],
      subject: 'Reset your Atrani password',
      htmlContent: `
        <div style="font-family: Manrope, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
          <div style="background: #1a1a1a; padding: 32px 40px;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #a37a41;">ATRANI</h1>
            <p style="margin: 4px 0 0; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #666;">Watches & Fine Writing</p>
          </div>
          <div style="padding: 48px 40px;">
            <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #1a1a1a;">Reset your password</h2>
            <p style="margin: 0 0 12px; font-size: 15px; color: #555; line-height: 1.6;">Hi ${name},</p>
            <p style="margin: 0 0 32px; font-size: 15px; color: #555; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.</p>
            <div style="text-align: center; margin: 0 0 40px;">
              <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: #a37a41; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">
                Reset Password
              </a>
            </div>
            <p style="margin: 0; font-size: 12px; color: #bbb; line-height: 1.6;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px 40px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">© 2025 Atrani Watches. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log('✅ Reset email sent to:', email);
  } catch (err) {
    console.error('❌ Reset email error:', err.message);
  }
}

module.exports = { emailApi, sendVerificationEmail, sendPasswordResetEmail };