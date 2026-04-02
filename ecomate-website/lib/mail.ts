import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailStrings {
  subject: string;
  title: string;
  sub: string;
  onboardingTitle: string;
  steps: string[];
  btn: string;
  footer: string;
}

const translations: Record<string, EmailStrings> = {
  en: {
    subject: "Your EcoMate Journey Starts Now! 🚀",
    title: "Welcome to the Digital Frontier",
    sub: "Your business is now part of Algeria's fastest-growing merchant network. Let's get you set up for success.",
    onboardingTitle: "Your Onboarding Roadmap",
    steps: [
      "Confirm your account using the Supabase verification link.",
      "Access your EcoMate Dashboard to set up your profile.",
      "Connect ManyChat & Yalidine to automate your sales."
    ],
    btn: "Launch My Store",
    footer: "Sent with ❤️ by the EcoMate Team | Algiers, Algeria 🇩🇿"
  },
  ar: {
    subject: "رحلتك مع إيكومات تبدأ الآن! 🚀",
    title: "مرحباً بك في آفاق التجارة الرقمية",
    sub: "مشروعك أصبح الآن جزءاً من أسرع شبكة تجار نمواً في الجزائر. لنبدأ الإعداد للنجاح.",
    onboardingTitle: "خارطة طريق الانضمام",
    steps: [
      "أكد حسابك عبر رابط التحقق من Supabase.",
      "ادخل إلى لوحة تحكم إيكومات لإعداد ملفك الشخصي.",
      "اربط ManyChat و Yalidine لأتمتة مبيعاتك."
    ],
    btn: "ابدأ متجري الآن",
    footer: "تم الإرسال بكل ❤️ من فريق إيكومات | الجزائر العاصمة 🇩🇿"
  }
};

function getWelcomeHtml(strings: EmailStrings, isRtl: boolean) {
  const { title, sub, onboardingTitle, steps, btn, footer } = strings;
  return `
    <!DOCTYPE html>
    <html lang="${isRtl ? 'ar' : 'en'}" dir="${isRtl ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial, sans-serif; background-color: #050a14; color: #ffffff; }
        .wrapper { background-color: #050a14; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #07101f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%); padding: 60px 40px; text-align: center; position: relative; }
        .logo { font-size: 28px; font-weight: 800; margin-bottom: 24px; color: #ffffff; text-decoration: none; display: inline-block; letter-spacing: -1px; }
        .logo span { color: #34d399; }
        .title { font-size: 32px; font-weight: 800; margin-bottom: 16px; color: #ffffff; line-height: 1.1; letter-spacing: -1px; }
        .sub { font-size: 16px; opacity: 0.7; margin-bottom: 0; line-height: 1.6; font-weight: 500; }
        .content { padding: 48px; background-color: #07101f; }
        .section-title { font-size: 14px; font-weight: 800; color: #3b82f6; margin: 0 0 24px; text-transform: uppercase; letter-spacing: 0.2em; }
        .steps { list-style: none; padding: 0; margin: 0; }
        .step { display: flex; align-items: start; gap: 16px; margin-bottom: 20px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
        .step-num { min-width: 32px; height: 32px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; margin-${isRtl ? 'left' : 'right'}: 16px; }
        .step-text { font-size: 15px; line-height: 1.5; color: rgba(255,255,255,0.7); font-weight: 500; }
        .btn-container { text-align: center; margin-top: 40px; }
        .btn { display: inline-block; background: linear-gradient(to right, #2563eb, #1d4ed8); color: #ffffff !important; padding: 18px 48px; border-radius: 16px; text-decoration: none !important; font-weight: 800; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
        .footer { padding: 40px; background: #050a14; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 600; }
        @media only screen and (max-width: 600px) {
          .content { padding: 32px 24px; }
          .header { padding: 48px 24px; }
          .title { font-size: 26px; }
        }
      </style>
    </head>
    <body dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">Eco<span>Mate</span></div>
            <h1 class="title">${title}</h1>
            <p class="sub">${sub}</p>
          </div>
          <div class="content">
            <div class="section-title">${onboardingTitle}</div>
            <div class="steps">
              ${steps.map((s, i) => `
                <div class="step">
                  <div class="step-num">${i + 1}</div>
                  <div class="step-text">${s}</div>
                </div>
              `).join('')}
            </div>
            <div class="btn-container">
               <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">${btn}</a>
            </div>
          </div>
          <div class="footer">
            ${footer}<br/>
            &copy; 2026 EcoMate Tech Forge. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(email: string, locale: string = 'en') {
  const strings = translations[locale] || translations.en;
  const isRtl = locale === 'ar';
  
  const html = getWelcomeHtml(strings, isRtl);

  try {
    const { data, error } = await resend.emails.send({
      from: 'EcoMate <no-reply@resend.dev>',
      to: [email],
      subject: strings.subject,
      html,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error };
  }
}
