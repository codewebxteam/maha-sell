"use client";

import Image from "next/image";
import { Heart, ArrowUpRight } from "lucide-react";
import { useStoreConfig } from "@/context/StoreConfigContext";

export const UGC_POSTS_DATA = [
  {
    id: 1,
    image: "https://ik.imagekit.io/mahasell/hero1phone.webp",
    handle: "@rohit_style",
    caption: "Festive mood in my new kurta from @mahasell.in ✨",
    likes: "2.4k",
    socialUrl: "https://instagram.com/mahasell.in"
  },
  {
    id: 2,
    image: "https://ik.imagekit.io/mahasell/hero2phonesell.webp",
    handle: "@shreya_fashion",
    caption: "Festive fits with maximum savings! 💛",
    likes: "4.1k",
    socialUrl: "https://instagram.com/mahasell.in"
  },
  {
    id: 3,
    image: "https://ik.imagekit.io/mahasell/hero3phone.webp",
    handle: "@little_stars_mom",
    caption: "Adorable festive ethnic sets for the kids 💫",
    likes: "1.9k",
    socialUrl: "https://instagram.com/mahasell.in"
  },
  {
    id: 4,
    image: "https://ik.imagekit.io/mahasell/hero4phonesell.webp",
    handle: "@sneaker_head_delhi",
    caption: "Stepping out in fresh kicks from Maha Mega Sale 👟",
    likes: "5.8k",
    socialUrl: "https://instagram.com/mahasell.in"
  },
  {
    id: 5,
    image: "https://ik.imagekit.io/mahasell/mainherophone.webp",
    handle: "@ananya_trends",
    caption: "Graceful festive party wear with super fast delivery 🌸",
    likes: "3.2k",
    socialUrl: "https://instagram.com/mahasell.in"
  },
  {
    id: 6,
    image: "https://ik.imagekit.io/mahasell/hero1phone.webp",
    handle: "@streetwear_india",
    caption: "Quality styles at wholesale prices ☀️",
    likes: "2.7k",
    socialUrl: "https://instagram.com/mahasell.in"
  }
];

export default function InstagramUgc({ posts = UGC_POSTS_DATA }) {
  const { config } = useStoreConfig();
  const instagramUrl = config?.socialLinks?.instagram || "https://instagram.com/mahasell.in";

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-4 h-4 fill-amber-600" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9E7D2E] font-bold">
                @mahasell.in
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2D0A10]">
              Customer Looks &amp; Style
            </h2>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3E0C15] hover:text-[#571520] transition-colors group"
          >
            <span>Follow @mahasell.in</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 
          Responsive Grid:
          - Desktop (lg): Exactly ~6 tiles in 1 row (lg:grid-cols-6)
          - Mobile (sm/mobile): Exactly 2-column grid (grid-cols-2)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {posts.map((post) => (
            <a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Instagram post by ${post.handle}`}
              className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 block border border-amber-900/10 bg-stone-900"
            >
              <Image
                src={post.image}
                alt={`Instagram UGC ${post.handle}`}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />

              {/* Hover Overlay with Social Content */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 sm:p-4 text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300 text-[11px] truncate max-w-[80px]">
                    {post.handle}
                  </span>
                  <div className="flex items-center gap-1 text-rose-400 shrink-0">
                    <Heart className="w-3.5 h-3.5 fill-rose-400" />
                    <span className="text-[10px] font-bold text-white">{post.likes}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-stone-200 line-clamp-2 leading-tight">
                    {post.caption}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] uppercase font-bold tracking-wider text-amber-400">
                    <span>View Post</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>

              {/* Static Instagram Watermark Icon Badge */}
              <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:opacity-0 transition-opacity">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
