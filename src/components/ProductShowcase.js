"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProductShowcase() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShowcaseProducts() {
      try {
        const q = query(collection(db, "products"), limit(8));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (err) {
        console.error("Error fetching showcase products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShowcaseProducts();
  }, []);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#F5EFE6]/60 border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#9E7D2E] font-semibold">
                Spotlight Deals
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-medium text-[#2D0A10]">
              Featured Products
            </h2>
          </div>
          <Link 
            href="/collections" 
            className="text-xs font-bold uppercase tracking-wider text-[#3E0C15] hover:text-[#571520] mt-3 md:mt-0"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
