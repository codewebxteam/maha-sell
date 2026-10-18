import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const baseUrl = "https://mahasell.in";

  let product = null;
  try {
    const q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      product = { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
  } catch (e) {
    console.warn("Product metadata error:", e);
  }

  const title = product?.name 
    ? `${product.name} | Maha Sell` 
    : `Shop Online • Best Wholesale Deals | Maha Sell`;
  
  const description = product?.description 
    ? product.description.slice(0, 160)
    : "Shop top trending fashion, footwear & festive styles at wholesale prices with express delivery across India on Maha Sell.";

  const imageUrl = product?.images?.[0] || product?.image || "https://ik.imagekit.io/mahasell/mainhero.webp";
  const canonicalUrl = `${baseUrl}/product/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Maha Sell",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product?.name || "Maha Sell Product",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@mahasell.in",
    },
  };
}

export default async function ProductLayout({ children, params }) {
  const { slug } = await params;
  const baseUrl = "https://mahasell.in";

  let product = null;
  try {
    const q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      product = { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
  } catch (e) {}

  const productJsonLd = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [product.image || "https://ik.imagekit.io/mahasell/mainhero.webp"],
    "description": product.description || `Buy ${product.name} at wholesale prices on Maha Sell.`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Maha Sell"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${slug}`,
      "priceCurrency": "INR",
      "price": product.price || 999,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Maha Sell"
      }
    }
  } : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
