import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string, locale: string = 'en') {
  const isAr = locale === 'ar';
  
  const subject = isAr 
    ? 'تأكيد الحساب - EcoMate Pro' 
    : 'Verify Your Account - EcoMate Pro';

  const html = isAr ? `
    <div dir="rtl" style="font-family: sans-serif; padding: 20px;">
      <h2>مرحباً بك في EcoMate Pro!</h2>
      <p>شكراً لتسجيلك. يرجى الضغط على الرابط أدناه لتفعيل حسابك:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}" 
         style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        تفعيل الحساب
      </a>
    </div>
  ` : `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Welcome to EcoMate Pro!</h2>
      <p>Thank you for signing up. Please click the button below to verify your email:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}" 
         style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        Verify Account
      </a>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'EcoMate <onboarding@resend.dev>',
      to: [email],
      subject,
      html,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error };
  }
}
