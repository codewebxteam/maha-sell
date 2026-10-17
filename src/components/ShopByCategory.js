"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const CATEGORIES_DATA = [
  {
    id: "mens-wear",
    name: "Men's Wear",
    slug: "mens-wear",
    description: "Shirts, T-Shirts, Kurtas & Jeans",
    image: "https://ik.imagekit.io/mahasell/hero1phone.webp",
    badge: "Mega Deals"
  },
  {
    id: "womens-wear",
    name: "Women's Wear",
    slug: "womens-wear",
    description: "Sarees, Kurtis, Dresses & Tops",
    image: "https://ik.imagekit.io/mahasell/hero2phonesell.webp",
    badge: "Bestseller"
  },
  {
    id: "kids-wear",
    name: "Kids' Wear",
    slug: "kids-wear",
    description: "Boys, Girls & Baby Clothing",
    image: "https://ik.imagekit.io/mahasell/hero3phone.webp",
    badge: "Festive Joy"
  },
  {
    id: "footwear",
    name: "Footwear",
    slug: "footwear",
    description: "Sneakers, Formal Shoes, Mojaris & Heels",
    image: "https://ik.imagekit.io/mahasell/hero4phonesell.webp",
    badge: "Best Prices"
  }
];

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(
          collection(db, "categories"),
          where("isSubcategory", "==", false)
        );
        const snapshot = await getDocs(q);
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cats.length > 0) {
          setCategories(cats);
        }
      } catch (error) {
        console.warn("Notice: Fetching categories from Firestore:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : CATEGORIES_DATA;

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
            Curated Department Store
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-medium text-[#2D0A10] mt-1 mb-2">
            Shop By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A049] mx-auto" />
        </div>

        {/* 
          Category Grid:
          - Desktop (lg): 4 cards per row across 2 rows (8 categories total)
          - Mobile (grid-cols-2): 2 cards per row
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-[#3E0C15] hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Category Image Box - 1:1 Square */}
              <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                <Image
                  src={cat.image || "/placeholder.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {cat.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-[#3E0C15]/90 text-[#F3E5C8] text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Category Label & CTA */}
              <div className="p-3.5 flex flex-col justify-between flex-1 bg-white text-center">
                <div>
                  <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#3E0C15] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </div>

                {/* Shop Now Action */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#3E0C15] group-hover:text-amber-700 transition-colors">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
