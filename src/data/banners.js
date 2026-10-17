/**
 * Dynamic Banner, Campaign & Promotional Announcement Data
 * Consumed by: HeroSlider, AnnouncementBar, PromotionalStrip, MarqueeBanner, FeaturedCollectionBanner.
 */

// Hero campaign slideshow slides
export const HERO_SLIDES = [
  {
    id: "hero-main",
    desktopBanner: "https://ik.imagekit.io/mahasell/mainhero.webp",
    mobileBanner: "https://ik.imagekit.io/mahasell/mainherophone.webp",
    heading: "India's Grand Festive Mega Sale",
    subheading: "Celebrate festive moments with royal ethnic wear, bridal glam & lifestyle footwear at India's best prices.",
    ctaText: "Shop Grand Sale",
    ctaUrl: "/collections",
    badge: "Mega Deal Edition",
    tagline: "Grand Savings • Unmatched Luxury",
  },
  {
    id: "hero-1",
    desktopBanner: "https://ik.imagekit.io/mahasell/hero1mahasell.webp",
    mobileBanner: "https://ik.imagekit.io/mahasell/hero1phone.webp",
    heading: "Grand Festive Edit For Men",
    subheading: "Handcrafted kurtas, celebratory royal styles & festive silhouettes at unmatched mega savings.",
    ctaText: "Shop Festive Edit",
    ctaUrl: "/collections",
    badge: "Maha Festive 2026",
    tagline: "Premium Men's Wear • Mega Deals",
  },
  {
    id: "hero-2",
    desktopBanner: "https://ik.imagekit.io/mahasell/hero3mahasell.webp",
    mobileBanner: "https://ik.imagekit.io/mahasell/hero2phonesell.webp",
    heading: "Royal Festive Elegance",
    subheading: "Timeless mother-daughter ethnic drapes, shimmering lehengas & celebratory silks.",
    ctaText: "Shop Festive Glamour",
    ctaUrl: "/collections",
    badge: "Bestseller Collection",
    tagline: "Heirloom Silks • Exclusive Discounts",
  },
  {
    id: "hero-3",
    desktopBanner: "https://ik.imagekit.io/mahasell/hero2mahasell.webp",
    mobileBanner: "https://ik.imagekit.io/mahasell/hero3phone.webp",
    heading: "Little Stars Festive Joy",
    subheading: "Adorable festive lehengas & ethnic wear crafted with comfortable fabrics for joyous celebrations.",
    ctaText: "Explore Kids Edit",
    ctaUrl: "/collections",
    badge: "Kids Festive Special",
    tagline: "Festive Joy • Unmatched Prices",
  },
  {
    id: "hero-4",
    desktopBanner: "https://ik.imagekit.io/mahasell/hero4mahasell.webp",
    mobileBanner: "https://ik.imagekit.io/mahasell/hero4phonesell.webp",
    heading: "Festive Steps & Royal Footwear",
    subheading: "Complete your look with handcrafted mojaris, glamorous party heels & versatile lifestyle sneakers.",
    ctaText: "Explore Footwear",
    ctaUrl: "/collections",
    badge: "Footwear Vault",
    tagline: "Complete The Look • Best Price Guarantee",
  },
];

// Top announcement messages rotating in AnnouncementBar
export const ANNOUNCEMENT_MESSAGES = [
  {
    id: "msg-1",
    text: "🔥 Maha Mega Sale is Live: Flat 50% to 80% Off on Men, Women, Kids & Footwear!",
    linkText: "Shop Mega Deals",
    href: "/sale",
    icon: "Sparkles",
  },
  {
    id: "msg-2",
    text: "⚡ Free Express Delivery on All Prepaid Orders Across India • Easy 7-Day Returns",
    linkText: "Explore Catalog",
    href: "/collections",
    icon: "Truck",
  },
  {
    id: "msg-3",
    text: "🎁 Extra 10% Off on Your First Order! Use Code",
    couponCode: "MAHA10",
    linkText: "Claim Now",
    href: "/sale",
    icon: "Tag",
  },
];

// Marquee text items rotating across the homepage strip
export const MARQUEE_ITEMS = [
  "⚡ INDIA'S BIGGEST MEGA SALE",
  "MEN'S WEAR • WOMEN'S WEAR • KIDS' WEAR • FOOTWEAR",
  "FLAT 50% - 80% OFF ON TOP PRODUCTS",
  "100% ORIGINAL & VERIFIED PRODUCTS",
  "FREE DELIVERY ACROSS INDIA",
  "7-DAY HASSLE-FREE RETURNS & REFUNDS",
  "CASH ON DELIVERY AVAILABLE",
  "BEST WHOLESALE PRICES GUARANTEED",
];

// Promotional Coupons available sitewide
export const PROMOTIONAL_COUPONS = [
  {
    code: "MAHA10",
    discountPercent: 10,
    minOrderAmount: 999,
    description: "Extra 10% Off on orders above ₹999",
  },
  {
    code: "MEGA20",
    discountPercent: 20,
    minOrderAmount: 2499,
    description: "Flat 20% Off on mega shopping above ₹2,499",
  },
  {
    code: "FLAT500",
    discountFlat: 500,
    minOrderAmount: 1999,
    description: "Flat ₹500 discount on cart value above ₹1,999",
  },
];
