/**
 * Dynamic Filter Specifications & Options for MAHA SELL
 * Clean, Flipkart-style e-commerce filter brackets
 */

export const FILTER_CRITERIA = {
  categories: [
    { label: "All Products", value: "all" },
    { label: "Men's Wear", value: "mens-wear" },
    { label: "Women's Wear", value: "womens-wear" },
    { label: "Kids' Wear", value: "kids-wear" },
    { label: "Footwear", value: "footwear" },
    { label: "Sarees & Ethnic", value: "sarees" },
  ],
  occasions: [
    { label: "All Occasions", value: "all" },
    { label: "Daily Casual", value: "casual" },
    { label: "Festive & Celebrations", value: "festive" },
    { label: "Party & Night Out", value: "party" },
    { label: "Wedding & Grand", value: "wedding" },
  ],
  fabrics: [
    { label: "All Materials", value: "all" },
    { label: "Pure Cotton", value: "cotton" },
    { label: "Denim & Twill", value: "denim" },
    { label: "Pure Silk", value: "silk" },
    { label: "Linen & Blends", value: "linen" },
    { label: "Leather & Mesh", value: "leather" },
  ],
  colors: [
    { label: "All Colours", value: "all", hex: null },
    { label: "Black", value: "black", hex: "#111111" },
    { label: "White", value: "white", hex: "#FFFFFF" },
    { label: "Blue & Navy", value: "blue", hex: "#1A2A6C" },
    { label: "Red & Crimson", value: "red", hex: "#B71C1C" },
    { label: "Green & Olive", value: "green", hex: "#0D593F" },
    { label: "Yellow & Mustard", value: "yellow", hex: "#FBC02D" },
    { label: "Pink & Rose", value: "pink", hex: "#C2185B" },
    { label: "Gold & Champagne", value: "gold", hex: "#D4AF37" },
  ],
  priceRanges: [
    { label: "All Prices", min: 0, max: 1000000, value: "all" },
    { label: "Under ₹499", min: 0, max: 499, value: "under-499" },
    { label: "₹500 – ₹999", min: 500, max: 999, value: "500-999" },
    { label: "₹1,000 – ₹2,499", min: 1000, max: 2499, value: "1k-2.5k" },
    { label: "₹2,500 – ₹4,999", min: 2500, max: 4999, value: "2.5k-5k" },
    { label: "Above ₹5,000", min: 5000, max: 1000000, value: "above-5k" },
  ],
  discounts: [
    { label: "All Items", minDiscount: 0, value: "all" },
    { label: "10% & Above", minDiscount: 10, value: "10" },
    { label: "20% & Above", minDiscount: 20, value: "20" },
    { label: "30% & Above", minDiscount: 30, value: "30" },
    { label: "50% & Above", minDiscount: 50, value: "50" },
  ],
  availability: [
    { label: "All Items", value: "all" },
    { label: "In Stock Only (Ready to Dispatch)", value: "in-stock" },
  ],
  sortOptions: [
    { label: "Featured", value: "featured" },
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price-low-high" },
    { label: "Price: High to Low", value: "price-high-low" },
    { label: "Best Selling", value: "bestselling" },
    { label: "Customer Rating", value: "rating" },
  ],
};
