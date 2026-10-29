import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap() {
  const baseUrl = "https://mahasell.in";

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/mens-wear`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/womens-wear`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/kids-wear`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/footwear`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections/sarees`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sale`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bestsellers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/new-arrivals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pages/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pages/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pages/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pages/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Product routes from Firestore
  let productRoutes = [];
  try {
    const q = query(collection(db, "products"), limit(500));
    const snap = await getDocs(q);
    productRoutes = snap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        const slug = data.slug || docSnap.id;
        let lm = new Date();
        try {
          if (data.updatedAt?.toDate) {
            lm = data.updatedAt.toDate();
          } else if (data.updatedAt?.seconds) {
            lm = new Date(data.updatedAt.seconds * 1000);
          } else if (data.createdAt?.toDate) {
            lm = data.createdAt.toDate();
          } else if (data.createdAt?.seconds) {
            lm = new Date(data.createdAt.seconds * 1000);
          } else if (data.updatedAt && !isNaN(new Date(data.updatedAt).getTime())) {
            lm = new Date(data.updatedAt);
          }
        } catch (_) {
          lm = new Date();
        }

        return {
          url: `${baseUrl}/product/${slug}`,
          lastModified: lm,
          changeFrequency: "weekly",
          priority: 0.8,
        };
      })
      .filter((p) => Boolean(p.url));
  } catch (err) {
    console.warn("Sitemap: error fetching dynamic products:", err?.message || err);
  }

  return [...staticRoutes, ...productRoutes];
}
