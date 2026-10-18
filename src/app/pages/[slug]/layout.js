const PAGE_SEO = {
  "about-us": {
    title: "About Us • Our Story & Mission | Maha Sell",
    description: "Learn about Maha Sell, India's leading shopping destination bringing wholesale mega deals, verified quality and transparency directly to consumers.",
  },
  "contact-us": {
    title: "Contact Us • Customer Care & Support | Maha Sell",
    description: "Need help? Contact Maha Sell customer concierge via phone at +91 9770150015, WhatsApp, or email info@mahasell.in. Open 7 days a week.",
  },
  "shipping-policy": {
    title: "Shipping & Delivery Policy | Maha Sell",
    description: "Read Maha Sell's express delivery timelines, shipping partners, complimentary delivery rules across 19,000+ Indian PIN codes.",
  },
  "faq": {
    title: "Frequently Asked Questions (FAQs) | Maha Sell",
    description: "Find instant answers to questions regarding orders, payments, cancellations, return process, and product authenticity on Maha Sell.",
  },
  "care-guide": {
    title: "Product Care & Maintenance Guide | Maha Sell",
    description: "Essential care guidelines to preserve your fashion garments, fabrics, and footwear longevity.",
  },
  "size-guide": {
    title: "Size & Measurement Charts | Maha Sell",
    description: "Comprehensive size guides and measurements across Men's Wear, Women's Fashion, Kids & Footwear.",
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const seo = PAGE_SEO[slug] || {
    title: `${slug.replace("-", " ").toUpperCase()} | Maha Sell`,
    description: "Maha Sell - India's Mega Savings & Shopping Destination.",
  };

  const canonicalUrl = `https://mahasell.in/pages/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: "Maha Sell",
    },
  };
}

export default function PagesLayout({ children }) {
  return children;
}
