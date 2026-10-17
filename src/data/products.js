/**
 * Product Data & Taxonomy Definitions for MAHA SELL
 * All products are dynamically managed via Firebase Firestore Admin Panel.
 * Dummy products removed - live products are fetched directly from Firestore.
 */

export const PRODUCTS = [];

// Clean, Flipkart-style Mega Category Metadata
export const CATEGORY_META = {
  "mens-wear": {
    name: "Men's Fashion",
    description: "Trending shirts, t-shirts, kurtas, jeans, trousers & accessories at best mega prices.",
    banner: "https://ik.imagekit.io/mahasell/hero1mahasell.webp",
  },
  "womens-wear": {
    name: "Women's Fashion",
    description: "Sarees, kurtis, dresses, tops, festive ethnic wear & western fashion.",
    banner: "https://ik.imagekit.io/mahasell/hero3mahasell.webp",
  },
  "kids-wear": {
    name: "Kids & Baby Wear",
    description: "Comfortable, playful & stylish clothes for boys, girls, infants & party celebrations.",
    banner: "https://ik.imagekit.io/mahasell/hero2mahasell.webp",
  },
  "footwear": {
    name: "Footwear",
    description: "Sneakers, casual shoes, formal shoes, party heels, flats & traditional mojaris.",
    banner: "https://ik.imagekit.io/mahasell/hero4mahasell.webp",
  },
  "sarees": {
    name: "Sarees Collection",
    description: "Festive, wedding & daily wear sarees direct from manufacturers.",
    banner: "https://ik.imagekit.io/mahasell/mainhero.webp",
  },
  "sale": {
    name: "Maha Mega Deals",
    description: "Huge discounts of 50% to 80% off across all departments.",
    banner: "https://ik.imagekit.io/mahasell/mainhero.webp",
  }
};

export const OCCASION_META = {
  "festive": {
    name: "Festive Edit",
    description: "Bright colors and celebratory styles for Diwali, Eid, and family festivities.",
    banner: "https://ik.imagekit.io/mahasell/hero3mahasell.webp",
  },
  "wedding": {
    name: "Wedding & Grand Celebrations",
    description: "Royal attire for weddings, engagements and grand celebrations.",
    banner: "https://ik.imagekit.io/mahasell/hero1mahasell.webp",
  },
  "party": {
    name: "Party & Cocktail Glam",
    description: "Modern evening silhouettes and statement styles for dinners and parties.",
    banner: "https://ik.imagekit.io/mahasell/mainhero.webp",
  },
  "casual": {
    name: "Daily Casuals",
    description: "Effortless, all-day comfortable everyday wear.",
    banner: "https://ik.imagekit.io/mahasell/hero2mahasell.webp",
  }
};

export const FABRIC_META = {
  "cotton": {
    name: "Pure Cotton",
    description: "Breathable, lightweight and all-weather natural comfort.",
    banner: "https://ik.imagekit.io/mahasell/hero1mahasell.webp",
  },
  "silk": {
    name: "Pure Silk",
    description: "Lustrous, premium textures for celebratory occasions.",
    banner: "https://ik.imagekit.io/mahasell/hero3mahasell.webp",
  },
  "denim": {
    name: "Denim & Twill",
    description: "Durable, high-grade denim fits for modern style.",
    banner: "https://ik.imagekit.io/mahasell/hero4mahasell.webp",
  },
  "chiffon": {
    name: "Khaddi Chiffon",
    description: "Featherlight, soft flowing silhouettes.",
    banner: "https://ik.imagekit.io/mahasell/mainhero.webp",
  }
};

export const COLOR_META = {
  "black": { name: "Black", hex: "#111111" },
  "white": { name: "White", hex: "#FFFFFF" },
  "blue": { name: "Royal Blue & Navy", hex: "#1A2A6C" },
  "red": { name: "Crimson & Red", hex: "#B71C1C" },
  "green": { name: "Olive & Emerald Green", hex: "#0D593F" },
  "yellow": { name: "Sunshine Yellow", hex: "#FBC02D" },
  "pink": { name: "Rose & Pink", hex: "#C2185B" },
  "gold": { name: "Champagne Gold", hex: "#D4AF37" }
};
