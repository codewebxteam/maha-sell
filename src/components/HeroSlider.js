"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { HERO_SLIDES } from "@/data/banners";

export const HERO_CAMPAIGN_SLIDES = HERO_SLIDES;

export default function HeroSlider({ slides = HERO_SLIDES, interval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-scroll slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [interval, nextSlide]);

  return (
    <section className="relative w-full bg-[#120B08] overflow-hidden select-none">
      
      {/* 
        Responsive Carousel Container:
        - Desktop: Natural widescreen campaign banner matching 1961:802 ratio
        - Mobile: Dedicated 941:1672 portrait phone banner matching exact artwork
      */}
      <div className="relative w-full aspect-[941/1672] md:aspect-[1961/802] overflow-hidden bg-black">
        
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-[1.02] pointer-events-none"
              } transition-transform duration-1000`}
            >
              {/* 1. Desktop Artwork (Widescreen 1961:802) */}
              <div className="hidden md:block absolute inset-0 w-full h-full">
                <Image
                  src={slide.desktopBanner}
                  alt={`${slide.heading} - Maha Sell Campaign`}
                  fill
                  priority={index === 0}
                  className="w-full h-full object-cover object-center"
                  sizes="100vw"
                  quality={95}
                />
              </div>

              {/* 2. Mobile Artwork (Dedicated Portrait 941:1672) */}
              <div className="block md:hidden absolute inset-0 w-full h-full">
                <Image
                  src={slide.mobileBanner}
                  alt={`${slide.heading} - Maha Sell Campaign`}
                  fill
                  priority={index === 0}
                  className="w-full h-full object-cover object-center"
                  sizes="100vw"
                  quality={95}
                />
              </div>

              {/* Note: NO background scrim or dark gradient behind text per user instruction ("text k background m kuch v na rkhna") */}

              {/* Content Overlay: Heading, Subheading, Badge, CTA (Completely transparent background, clean typography with drop shadows) */}
              <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 flex flex-col justify-start pt-8 sm:pt-12 md:justify-center md:pt-0 items-start z-20 pointer-events-none">
                <div className="max-w-xl text-white flex flex-col items-start text-left pointer-events-auto">
                  
                  {/* Badge - Clean without any background */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mb-2 sm:mb-2.5 self-start">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  {/* Heading */}
                  <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight text-[#FAF7F2] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] mb-2 sm:mb-3 text-left">
                    {slide.heading}
                  </h1>

                  {/* Subheading */}
                  <p className="text-xs sm:text-sm md:text-base text-stone-100 font-normal leading-relaxed max-w-md mb-4 sm:mb-5 line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mr-auto text-left">
                    {slide.subheading}
                  </p>

                  {/* CTA Button -> Opens relevant collection URL */}
                  <div className="mt-1 self-start">
                    <Link
                      href={slide.ctaUrl}
                      className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-2xl hover:shadow-amber-500/30 transition-all active:scale-95"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          );
        })}

        {/* Navigation Left Arrow */}
        <button
          onClick={(e) => { e.preventDefault(); prevSlide(); }}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={(e) => { e.preventDefault(); nextSlide(); }}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>

        {/* Bottom Slide Indicators & Counter */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 inset-x-0 z-30 flex justify-center items-center">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-white/15">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-6 sm:w-8 bg-amber-400"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
