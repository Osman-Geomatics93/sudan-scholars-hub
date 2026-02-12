import { Resend } from 'resend';
import { getResendApiKey } from './env';

let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(getResendApiKey());
  }
  return resend;
}

/**
 * Escape HTML special characters to prevent XSS in emails
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char]);
}

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || '424236@ogr.ktu.edu.tr';

  // Sanitize user inputs
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  await getResend().emails.send({
    from: 'Sudan Scholars Hub <noreply@deltaroots.store>',
    to: adminEmail,
    subject: `New Contact: ${safeSubject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">New Contact Form Submission</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p><strong>From:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="color: #374151;">Message:</h3>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
        <hr style="margin-top: 30px;" />
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent from Sudan Scholars Hub contact form.
        </p>
      </div>
    `,
    replyTo: email,
  });
}

export async function sendWelcomeEmail({ email }: { email: string }) {
  const unsubscribeUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

  await getResend().emails.send({
    from: 'Sudan Scholars Hub <noreply@deltaroots.store>',
    to: email,
    subject: 'Welcome to Sudan Scholars Hub Newsletter! 🎓',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Sudan Scholars Hub!</h1>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">Your journey to international education starts here</p>
        </div>

        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to our newsletter! You're now part of a growing community of Sudanese students pursuing international scholarship opportunities.
          </p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What you'll receive:</h3>
            <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
              <li>New scholarship opportunities matching your interests</li>
              <li>Application deadline reminders</li>
              <li>Tips for successful scholarship applications</li>
              <li>Success stories from fellow Sudanese scholars</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/scholarships"
               style="background: #1e40af; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Browse Scholarships
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Have questions? Feel free to reach out to us anytime. We're here to help you succeed in your educational journey.
          </p>
        </div>

        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Sudan Scholars Hub - Empowering Sudanese Students Worldwide
          </p>
          <p style="margin-top: 10px;">
            <a href="${unsubscribeUrl}" style="color: #6b7280; font-size: 11px; text-decoration: underline;">
              Unsubscribe from this newsletter
            </a>
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendMaterialReviewNotification({
  email,
  userName,
  materialTitle,
  status,
  rejectionNote,
  studyHubUrl,
}: {
  email: string;
  userName: string;
  materialTitle: string;
  status: 'APPROVED' | 'REJECTED';
  rejectionNote?: string | null;
  studyHubUrl: string;
}) {
  const safeName = escapeHtml(userName);
  const safeTitle = escapeHtml(materialTitle);
  const isApproved = status === 'APPROVED';

  const subject = isApproved
    ? `Your material "${safeTitle}" has been approved!`
    : `Update on your material "${safeTitle}"`;

  const headerBg = isApproved
    ? 'linear-gradient(135deg, #065f46 0%, #10b981 100%)'
    : 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)';

  const accentColor = isApproved ? '#065f46' : '#92400e';

  const heading = isApproved
    ? 'Material Approved!'
    : 'Material Not Approved';

  const bodyContent = isApproved
    ? `
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Congratulations, ${safeName}! Your study material <strong>"${safeTitle}"</strong> has been reviewed and approved.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            It is now publicly available on the Study Hub for other students to benefit from. Thank you for your valuable contribution!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${studyHubUrl}"
               style="background: ${accentColor}; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View on Study Hub
            </a>
          </div>
    `
    : `
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi ${safeName}, thank you for submitting your study material <strong>"${safeTitle}"</strong>.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            After review, we were unable to approve it at this time.
          </p>
          ${rejectionNote ? `
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="color: #92400e; font-weight: bold; margin: 0 0 8px 0;">Reason:</p>
            <p style="color: #78350f; margin: 0;">${escapeHtml(rejectionNote)}</p>
          </div>
          ` : ''}
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Don't be discouraged! You can update your material and re-upload it for another review.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${studyHubUrl}"
               style="background: ${accentColor}; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Go to Study Hub
            </a>
          </div>
    `;

  await getResend().emails.send({
    from: 'Sudan Scholars Hub <noreply@deltaroots.store>',
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: ${headerBg}; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${heading}</h1>
        </div>
        <div style="padding: 30px 20px;">
          ${bodyContent}
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Sudan Scholars Hub - Empowering Sudanese Students Worldwide
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminOTP({
  email,
  otpCode,
}: {
  email: string;
  otpCode: string;
}) {
  // OTP is generated internally, but escape just in case
  const safeOtpCode = escapeHtml(otpCode);

  await getResend().emails.send({
    from: 'Sudan Scholars Hub <noreply@deltaroots.store>',
    to: email,
    subject: 'Admin Login Code - Sudan Scholars Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <h2 style="color: #1e40af; margin-bottom: 10px;">Admin Login Verification</h2>
          <p style="color: #374151;">Your verification code is:</p>
        </div>
        <div style="background: #f3f4f6; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e40af;">
            ${safeOtpCode}
          </span>
        </div>
        <div style="text-align: center; padding: 20px;">
          <p style="color: #6b7280; font-size: 14px;">
            This code expires in <strong>5 minutes</strong>.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">
            Do not share this code with anyone. If you didn't request this code, please ignore this email.
          </p>
        </div>
        <hr style="margin-top: 20px; border-color: #e5e7eb;" />
        <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 20px;">
          Sudan Scholars Hub - Admin Panel
        </p>
      </div>
    `,
  });
}
