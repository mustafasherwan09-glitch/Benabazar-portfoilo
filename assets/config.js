/* ==========================================================================
   Bena Bazar — central business configuration
   Edit values here; every page reads from this object.
   Any value left empty ("") is hidden automatically on the website.
   ========================================================================== */
window.CONFIG = {
  name: { en: "Bena Bazar", ku: "بێنە بازاڕ", ar: "بينه بازار" },

  website: "https://www.benabazar.com",
  email: "info@benabazar.com",

  phone: {
    display: "+964 750 924 0950", // shown to visitors
    tel: "+9647509240950",         // used for tel: links
    whatsapp: "9647509240950"      // used for https://wa.me/ links (digits only)
  },

  social: {
    instagramHandle: "@bena.bazar",
    instagram: "https://www.instagram.com/bena.bazar",
    facebook: "https://www.facebook.com/share/1BCmGrr11t/"
  },

  address: {
    en: "40 Meter Street, Brayati, near Pharma, Erbil, Kurdistan Region, Iraq",
    ku: "شەقامی 40 مەتری، بڕایەتی، نزیک فارما، هەولێر، هەرێمی کوردستان، عێراق",
    ar: "شارع 40 متري، حي برايتي، قرب فارما، أربيل، إقليم كوردستان، العراق"
  },

  geo: { lat: 36.2004780, lng: 44.0392230 },
  mapsUrl: "https://www.google.com/maps?q=36.2004780,44.0392230",
  mapsEmbed: "https://maps.google.com/maps?q=36.2004780,44.0392230&z=16&output=embed",

  hours: {
    en: "Saturday to Thursday, 09:00 – 18:00 · Friday closed",
    ku: "شەممە تا پێنجشەممە، 09:00 – 18:00 · هەینی داخراوە",
    ar: "من السبت إلى الخميس، 09:00 – 18:00 · الجمعة مغلق"
  },

  // Pricing & logistics
  rate: 1450,                 // 1 USD = 1,450 IQD
  deliveryDays: "15–25",
  deliveryFee: { kurdistan: 5000, other: 7000 }, // door delivery inside Iraq (IQD)
  prepayThresholdUSD: 300,    // no prepayment up to this amount
  prepayPercent: 25,          // % paid in advance above the threshold
  deliveryAttempts: "3–5",
  dataRetentionMonths: 6,

  policiesUpdated: { en: "November 7, 2026", ku: "7ی تشرینی دووەمی 2026", ar: "7 تشرين الثاني 2026" },
  copyrightYear: 2026
};
