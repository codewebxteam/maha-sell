import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartWishlistProvider } from "@/context/CartWishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { StoreConfigProvider } from "@/context/StoreConfigContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import WelcomeModal from "@/components/WelcomeModal";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://mahasell.in"),
  title: {
    default: "Maha Sell | India's Mega Savings & Shopping Destination",
    template: "%s | Maha Sell",
  },
  description: "Shop at Maha Sell for exclusive wholesale mega deals and huge discounts across Men's Wear, Women's Fashion, Kids' Wear & Footwear. 100% genuine products with fast doorstep delivery across India.",
  keywords: [
    "Maha Sell",
    "mahasell.in",
    "online shopping India",
    "mega sale India",
    "wholesale clothes online",
    "men clothing online",
    "women ethnic wear",
    "kids wear India",
    "shoes and footwear online",
    "cheap online shopping India",
    "best discounts clothes",
    "sarees online wholesale"
  ],
  authors: [{ name: "Maha Sell", url: "https://mahasell.in" }],
  creator: "Maha Sell",
  publisher: "Maha Sell",
  applicationName: "Maha Sell",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mahasell.in",
    siteName: "Maha Sell",
    title: "Maha Sell | India's Mega Savings & Shopping Destination",
    description: "Shop at Maha Sell for exclusive wholesale mega deals and huge discounts across Men's Wear, Women's Fashion, Kids' Wear & Footwear. 100% genuine products with fast doorstep delivery across India.",
    images: [
      {
        url: "https://ik.imagekit.io/mahasell/mainhero.webp",
        width: 1200,
        height: 630,
        alt: "Maha Sell - India's Mega Savings & Shopping Destination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maha Sell | India's Mega Savings & Shopping Destination",
    description: "Unbeatable wholesale mega discounts across Men's Wear, Women's Fashion, Kids & Footwear. 100% quality guaranteed.",
    images: ["https://ik.imagekit.io/mahasell/mainhero.webp"],
    creator: "@mahasell.in",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://mahasell.in/#website",
      "url": "https://mahasell.in",
      "name": "Maha Sell",
      "description": "India's Mega Savings & Shopping Destination",
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://mahasell.in/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": "en-IN"
    },
    {
      "@type": "Organization",
      "@id": "https://mahasell.in/#organization",
      "name": "Maha Sell",
      "legalName": "SP Gooseberry Textile Pvt. Ltd.",
      "url": "https://mahasell.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mahasell.in/icon.png",
        "caption": "Maha Sell Logo"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91 9770150015",
          "contactType": "customer service",
          "email": "info@mahasell.in",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      ],
      "sameAs": [
        "https://instagram.com/mahasell.in",
        "https://facebook.com/mahasell.in"
      ]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1F1815] selection:bg-[#E8C574] selection:text-[#2A170F] pb-16 lg:pb-0">
        <StoreConfigProvider>
          <AuthProvider>
            <CartWishlistProvider>
              {children}
              {/* Welcome Greeting Popup After Login */}
              <WelcomeModal />
              {/* Fixed Mobile Bottom Navigation Tab (Hidden on Desktop) */}
              <MobileBottomNav />
            </CartWishlistProvider>
          </AuthProvider>
        </StoreConfigProvider>
      </body>
    </html>
  );
}
