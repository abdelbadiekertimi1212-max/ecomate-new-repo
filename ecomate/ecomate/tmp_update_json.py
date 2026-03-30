import json

en_sections = {
  "Integrations": {
    "badge": "Connects seamlessly with the platforms your customers already use",
    "social": "Where your customers message you",
    "delivery": "Shipping partners across all wilayas",
    "tools": "Keep using the tools you love"
  },
  "Features": {
    "badge": "Everything You Need",
    "title1": "All-in-one platform.",
    "title2": "Zero fragmentation.",
    "sub": "EcoMate brings every capability into one seamless, affordable system — powered by real AI, built for real results.",
    "items": {
      "b1": {"title": "AI Sales Chatbot", "desc": "Deployed across all your social platforms. Responds 24/7 in Arabic, French and English.", "tag": "✓ Arabic · French · English"},
      "b2": {"title": "Order & COD Management", "desc": "All orders in one dashboard. Cash-on-delivery tracking and delivery sync — fully automatic."},
      "b3": {"title": "Product Catalog", "desc": "Add products once — sync automatically across your chatbot and dashboard."},
      "b5": {"title": "CRM — Customer Relations", "desc": "Every interaction and purchase history tracked automatically."},
      "b7": {"title": "Analytics Dashboard", "desc": "Real-time revenue, top products, and conversion rates."},
      "b8": {"title": "Delivery Integrations", "desc": "Integrated with all Algerian delivery companies. 58 Wilayas."}
    }
  },
  "How": {
    "badge": "Simple Process",
    "title1": "From zero to selling",
    "title2": "in 4 steps.",
    "sub": "We handle the complexity so you can focus on growing your business.",
    "steps": {
      "s1": {"title": "Tell Us Your Business", "desc": "Sign up and describe your activity. A quick onboarding call takes under 30 minutes."},
      "s2": {"title": "We Set Everything Up", "desc": "Our team configures your AI chatbot, catalog, and dashboard."},
      "s3": {"title": "Connect Your Channels", "desc": "Link your social pages and delivery partner in one click."},
      "s4": {"title": "Launch & Scale", "desc": "Go live. Your AI handles orders 24/7."}
    }
  },
  "Dashboard": {
    "badge": "Live Dashboard",
    "title1": "Your entire business.",
    "title2": "One screen.",
    "sub": "Real-time order tracking, revenue monitoring, and customer insights."
  },
  "AI": {
    "badge": "AI-Powered Core",
    "title1": "Your store sells",
    "title2": "while you sleep.",
    "sub": "Our AI handles the full customer journey automatically in Arabic, French, and English.",
    "features": [
      {"title": "All Social Platforms", "desc": "Facebook Messenger, Instagram DM, WhatsApp, Telegram."},
      {"title": "Interactive Shopping", "desc": "Customers browse products, pick size and color inside the chat."},
      {"title": "Auto Order Management", "desc": "Every order logged instantly to your dashboard."},
      {"title": "Delivery Auto-Tracking", "desc": "Customers receive live status updates automatically."}
    ],
    "cta": "See AI in Action"
  },
  "Pricing": {
    "badge": "Transparent Pricing",
    "title1": "Plans that",
    "title2": "scale with you.",
    "sub": "No hidden fees. No contracts.",
    "starter": {"name": "Starter", "price": "Contact Us", "period": "tailored to your scale", "cta": "Contact Sales"},
    "growth": {"name": "Growth", "price": "4,900", "period": "per month", "cta": "Book a Call →"},
    "business": {"name": "Business", "price": "Custom", "period": "tailored to your scale", "cta": "Contact Sales"}
  },
  "CTA": {
    "title1": "Ready to build your",
    "title2": "digital business?",
    "sub": "Join Algerian merchants already automating their sales.",
    "btn1": "Contact Sales ↗",
    "btn2": "📞 Talk to Our Team",
    "footer": "Built at University of Bouira Startup Incubator · 🇩🇿 Made in Algeria"
  },
  "Footer": {
    "desc": "The all-in-one SaaS platform helping Algerian SMEs build automated, scalable digital businesses."
  }
}

ar_sections = {
  "Integrations": {
    "badge": "يتصل بسلاسة مع المنصات التي يستخدمها عملاؤك",
    "social": "حيث يراسلك عملاؤك",
    "delivery": "شركاء التوصيل في جميع الولايات",
    "tools": "استمر في استخدام أدواتك المفضلة"
  },
  "Features": {
    "badge": "كل ما تحتاجه",
    "title1": "منصة شاملة.",
    "title2": "بدون تشتت.",
    "sub": "يجمع إيكومات كل القدرات في نظام واحد سلس وبأسعار معقولة — مدعوم بذكاء اصطناعي حقيقي، ومُصمم لنتائج حقيقية.",
    "items": {
      "b1": {"title": "روبوت المبيعات", "desc": "يعمل على جميع منصاتك الاجتماعية. يرد على مدار الساعة بالعربية والفرنسية والإنجليزية.", "tag": "✓ عربية · فرنسية · إنجليزية"},
      "b2": {"title": "إدارة الطلبات والدفع عند الاستلام", "desc": "جميع الطلبات في لوحة واحدة. تتبع التوصيل تلقائيا."},
      "b3": {"title": "كتالوج المنتجات", "desc": "أضف المنتجات مرة واحدة — تتزامن تلقائياً مع الروبوت واللوحة."},
      "b5": {"title": "إدارة علاقات العملاء", "desc": "تتبع كل تفاعل وسجل الشراء تلقائياً."},
      "b7": {"title": "لوحة التحليلات", "desc": "إيرادات الوقت الفعلي، أفضل المنتجات، ومعدلات التحويل."},
      "b8": {"title": "تكامل التوصيل", "desc": "متكامل مع جميع شركات التوصيل الجزائرية. 58 ولاية."}
    }
  },
  "How": {
    "badge": "عملية بسيطة",
    "title1": "من الصفر إلى البيع",
    "title2": "في 4 خطوات.",
    "sub": "نحن نتولى التعقيد لتتمكن من التركيز على تنمية عملك.",
    "steps": {
      "s1": {"title": "أخبرنا عن عملك", "desc": "سجل واشرح نشاطك. مكالمة الإعداد تستغرق أقل من 30 دقيقة."},
      "s2": {"title": "نحن نجهز كل شيء", "desc": "يقوم فريقنا بإعداد روبوت الذكاء الاصطناعي وكتالوج المنتجات واللوحة."},
      "s3": {"title": "اربط قنواتك", "desc": "اربط صفحاتك الاجتماعية وشريك التوصيل بضغطة واحدة."},
      "s4": {"title": "أطلق وانطلق", "desc": "انطلق. ذكاؤنا الاصطناعي يتعامل مع الطلبات على مدار الساعة."}
    }
  },
  "Dashboard": {
    "badge": "لوحة التحكم الحية",
    "title1": "عملك بالكامل.",
    "title2": "في شاشة واحدة.",
    "sub": "تتبع الطلبات لحظة بلحظة، راقب الإيرادات وتفاصيل العملاء."
  },
  "AI": {
    "badge": "نظام ذكاء اصطناعي",
    "title1": "متجرك يبيع",
    "title2": "بينما أنت نائم.",
    "sub": "يتولى روبوتنا رحلة العميل بالكامل — من اكتشاف المنتج إلى تأكيد الطلب — تلقائياً باللغات الثلاث.",
    "features": [
      {"title": "كل المنصات الاجتماعية", "desc": "فيسبوك ماسنجر، إنستغرام، واتساب، تيليجرام."},
      {"title": "تسوق تفاعلي في الدردشة", "desc": "تصفح المنتجات واختيار الحجم واللون والطلب داخل المحادثة."},
      {"title": "إدارة آلية للطلبات", "desc": "كل طلب يُسجل فوراً في لوحة التحكم الخاصة بك."},
      {"title": "تتبع آلي للتوصيل", "desc": "يتلقى العملاء تحديثات حالة التوصيل تلقائياً."}
    ],
    "cta": "شاهد الذكاء الاصطناعي"
  },
  "Pricing": {
    "badge": "أسعار شفافة",
    "title1": "باقات",
    "title2": "تنمو معك.",
    "sub": "بدون رسوم خفية. بدون عقود معقدة.",
    "starter": {"name": "التأسيس", "price": "تواصل معنا", "period": "مصمم ليناسب حجمك", "cta": "تواصل مع المبيعات"},
    "growth": {"name": "النمو", "price": "4,900", "period": "شهرياً", "cta": "احجز مكالمة →"},
    "business": {"name": "الأعمال", "price": "مخصص", "period": "مصمم ليناسب حجمك", "cta": "تواصل مع المبيعات"}
  },
  "CTA": {
    "title1": "مستعد لبناء",
    "title2": "عملك الرقمي؟",
    "sub": "انضم للتجار الجزائريين الذين يقومون بأتمتة مبيعاتهم.",
    "btn1": "تواصل مع المبيعات ↗",
    "btn2": "📞 تحدث مع فريقنا",
    "footer": "تم بناؤه في حاضنة أعمال جامعة البويرة · 🇩🇿 صُنع في الجزائر"
  },
  "Footer": {
    "desc": "المنصة الشاملة التي تساعد رواد الأعمال الجزائريين على بناء مشاريع رقمية قابلة للتوسع."
  }
}

en_path = "c:/Users/abdel/Desktop/ecomate claude/ecomate/ecomate/messages/en.json"
ar_path = "c:/Users/abdel/Desktop/ecomate claude/ecomate/ecomate/messages/ar.json"

for path, new_data in [(en_path, en_sections), (ar_path, ar_sections)]:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data["Sections"] = new_data
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated JSON files successfully.")
