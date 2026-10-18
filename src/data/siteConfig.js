/**
 * Core Site Configuration & Branding Metadata
 * Consumed across Header, Footer, Checkout, and Meta tags.
 */
export const SITE_CONFIG = {
  brandName: "Maha Sell",
  brandNameUpper: "MAHA SELL",
  companyName: "SP Gooseberry Textile Pvt. Ltd.",
  legalEntity: "SP Gooseberry Textile Pvt. Ltd.",
  tagline: "India's Mega Sale Destination",
  subTagline: "Mega Deals & Unmatched Savings",
  contact: {
    phone: "+91 9770150015",
    phoneDisplay: "+91 9770150015",
    whatsapp: "+91 9770150015",
    email: "info@mahasell.in",
    bridalEmail: "info@mahasell.in",
    address: "Maha Sell India • Online Operations & Customer Support Desk",
    workingHours: "Open All 7 Days: 10:00 AM – 9:00 PM IST",
  },
  socialLinks: {
    instagram: "https://instagram.com/mahasell.in",
    facebook: "https://facebook.com/mahasell.in",
  },
  currencies: [
    { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 1.0 },
    { code: "USD", symbol: "$", name: "US Dollar", rate: 0.012 },
    { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0095 },
    { code: "AED", symbol: "AED", name: "UAE Dirham", rate: 0.044 },
  ],
  certifications: [
    { name: "100% Original Products", icon: "Award", description: "Verified Quality Guarantee" },
    { name: "Buyer Protection", icon: "ShieldCheck", description: "7-Day Easy Returns & Refunds" },
    { name: "Fast Express Delivery", icon: "Truck", description: "Doorstep delivery across 19,000+ pin codes" },
    { name: "Mega Wholesale Savings", icon: "Sparkles", description: "Direct Sourcing at Best Prices" },
  ],
  paymentBadges: [
    { id: "upi", name: "UPI Instant (GPay / PhonePe / Paytm)" },
    { id: "visa", name: "Visa" },
    { id: "mastercard", name: "Mastercard" },
    { id: "rupay", name: "RuPay" },
    { id: "amex", name: "American Express" },
    { id: "netbanking", name: "50+ Net Banking Banks" },
    { id: "cod", name: "Cash on Delivery" },
  ],
};
