/**
 * Dynamic Navigation Configuration for MAHA SELL
 * Clean, Flipkart-style mega menu and catalog navigation
 */

// Desktop Header & Mega Menu
export const HEADER_NAV_ITEMS = [
  {
    id: "mens-wear",
    name: "MEN",
    href: "/collections/mens-wear",
    sublinks: [
      { name: "All Men's Wear", href: "/collections/mens-wear", description: "Shirts, T-shirts, Trousers & Kurtas" },
      { name: "Casual & Formal Shirts", href: "/collections/mens-wear", description: "Slim fit & relaxed everyday shirts" },
      { name: "Kurtas & Ethnic Sets", href: "/collections/mens-wear", description: "Festive & wedding ethnic kurtas" },
      { name: "Jeans & Trousers", href: "/collections/mens-wear", description: "Comfort stretch denims & chinos" },
    ],
    featuredPromo: {
      title: "Men's Festive Styles",
      subtitle: "Up to 60% Off",
      image: "https://ik.imagekit.io/mahasell/hero1mahasell.webp",
      href: "/collections/mens-wear",
    }
  },
  {
    id: "womens-wear",
    name: "WOMEN",
    href: "/collections/womens-wear",
    sublinks: [
      { name: "All Women's Wear", href: "/collections/womens-wear", description: "Sarees, Kurtis, Tops & Dresses" },
      { name: "Sarees Collection", href: "/collections/sarees", description: "Silk, Georgette, Chiffon & Party Sarees" },
      { name: "Kurtis & Salwar Sets", href: "/collections/womens-wear", description: "Daily wear & party wear kurtis" },
      { name: "Dresses & Western Wear", href: "/collections/womens-wear", description: "Trending dresses, tops & co-ord sets" },
    ],
    featuredPromo: {
      title: "Women's Mega Trends",
      subtitle: "Flat 50% - 70% Off",
      image: "https://ik.imagekit.io/mahasell/hero3mahasell.webp",
      href: "/collections/womens-wear",
    }
  },
  {
    id: "kids-wear",
    name: "KIDS",
    href: "/collections/kids-wear",
    sublinks: [
      { name: "All Kids' Wear", href: "/collections/kids-wear", description: "Boys & Girls festive & casual clothes" },
      { name: "Boys Clothing", href: "/collections/kids-wear", description: "T-shirts, shirts & ethnic kurtas" },
      { name: "Girls Clothing", href: "/collections/kids-wear", description: "Frocks, lehengas & dresses" },
      { name: "Baby & Infant Wear", href: "/collections/kids-wear", description: "Soft cotton rompers & sets" },
    ],
    featuredPromo: {
      title: "Kids Festive & Play",
      subtitle: "Under ₹999 Deals",
      image: "https://ik.imagekit.io/mahasell/hero2mahasell.webp",
      href: "/collections/kids-wear",
    }
  },
  {
    id: "footwear",
    name: "FOOTWEAR",
    href: "/collections/footwear",
    sublinks: [
      { name: "All Footwear", href: "/collections/footwear", description: "Men's, Women's & Kids' shoes" },
      { name: "Sneakers & Casual Shoes", href: "/collections/footwear", description: "Everyday comfort & walking shoes" },
      { name: "Formal Shoes & Heels", href: "/collections/footwear", description: "Party heels & leather formal shoes" },
      { name: "Ethnic Mojaris & Juttis", href: "/collections/footwear", description: "Handcrafted festive wedding footwear" },
    ],
    featuredPromo: {
      title: "Footwear Mega Clearance",
      subtitle: "Starting ₹499",
      image: "https://ik.imagekit.io/mahasell/hero4mahasell.webp",
      href: "/collections/footwear",
    }
  },
  {
    id: "sale",
    name: "MEGA DEALS",
    href: "/sale",
    isSale: true,
    badge: "50-80% OFF",
  },
  {
    id: "new-arrivals",
    name: "NEW IN",
    href: "/new-arrivals",
    badge: "New",
  },
  {
    id: "all-categories",
    name: "ALL CATEGORIES",
    href: "/collections",
  },
];

// Mobile Bottom Navigation Bar Links
export const MOBILE_BOTTOM_NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: "Home" },
  { id: "categories", label: "Categories", href: "/collections", icon: "Grid" },
  { id: "search", label: "Search", href: "/search", icon: "Search" },
  { id: "wishlist", label: "Wishlist", href: "/wishlist", icon: "Heart", showBadge: true },
  { id: "account", label: "Account", href: "/account", icon: "User" },
];

// Footer 4 Columns Data Structure
export const FOOTER_COLUMNS = [
  {
    id: "categories",
    title: "CATEGORIES",
    links: [
      { label: "Men's Fashion", href: "/collections/mens-wear" },
      { label: "Women's Fashion", href: "/collections/womens-wear" },
      { label: "Kids' Wear", href: "/collections/kids-wear" },
      { label: "Footwear", href: "/collections/footwear" },
      { label: "Sarees & Ethnic", href: "/collections/sarees" },
      { label: "Mega Deals & Offers", href: "/sale" },
    ],
  },
  {
    id: "customer-care",
    title: "CUSTOMER CARE",
    links: [
      { label: "Contact Us", href: "/pages/contact-us" },
      { label: "Track Your Order", href: "/track" },
      { label: "Shipping Policy", href: "/pages/shipping-policy" },
      { label: "Returns & Exchanges", href: "/refund-policy" },
      { label: "Help & FAQs", href: "/pages/faq" },
    ],
  },
  {
    id: "about-mahasell",
    title: "ABOUT MAHA SELL",
    links: [
      { label: "About Us", href: "/pages/about-us" },
      { label: "Become a Partner / Sell with Us", href: "/partner/register" },
      { label: "Partner Portal Login", href: "/login" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-and-conditions" },
    ],
  },
  {
    id: "connect",
    title: "CONNECT WITH US",
    links: [
      { label: "Instagram (@mahasell.in)", href: "https://instagram.com/mahasell.in", isExternal: true },
      { label: "Facebook", href: "https://facebook.com/mahasell.in", isExternal: true },
      { label: "WhatsApp Support", href: "https://wa.me/919770150015", isExternal: true },
    ],
  },
];
