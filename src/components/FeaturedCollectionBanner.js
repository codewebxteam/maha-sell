import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award } from "lucide-react";

export default function FeaturedCollectionBanner({
  title = "MAHA MEGA SAVINGS SALE",
  subtitle = "Unbeatable wholesale discounts across Men's Wear, Women's Fashion, Kids & Footwear. Top quality guaranteed.",
  badge = "Mega Season Deals 2026",
  image = "https://ik.imagekit.io/mahasell/section1.webp",
  ctaText = "Shop Mega Deals",
  ctaUrl = "/sale",
  secondaryCtaText = "Explore All Categories",
  secondaryCtaUrl = "/collections",
}) {
  return (
    <section className="w-full bg-[#180E0B] py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* 1. Desktop Layout (Wide screen: Image on right, text on left) */}
        <div className="hidden lg:flex relative rounded-3xl overflow-hidden bg-[#2D0A10] border border-amber-500/30 shadow-2xl min-h-[500px] items-center">
          
          {/* Full Banner Background Artwork */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={image}
              alt={`${title} - Maha Sell Family Shopping`}
              fill
              priority
              className="object-cover object-right"
              sizes="1280px"
            />
            {/* Desktop: Gentle maroon vignette so text on the left stays ultra-crisp while seamlessly blending into image */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#24070D] via-[#24070D]/75 to-transparent w-7/12" />
          </div>

          {/* Desktop Content Area */}
          <div className="relative z-10 w-full max-w-xl p-10 md:p-14 text-white space-y-5">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs uppercase font-bold tracking-widest w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{badge}</span>
            </div>

            {/* Campaign Heading */}
            <h2 className="font-serif-luxury text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight text-[#FAF7F2] drop-shadow-md">
              {title}
            </h2>

            {/* Subheading */}
            <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-lg font-light">
              {subtitle}
            </p>

            {/* Trust & Value Marks */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90 pt-1">
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Genuine & Verified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-500/20 backdrop-blur-md">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Best Mega Wholesale Prices</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl hover:shadow-amber-500/30 transition-all active:scale-95 group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={secondaryCtaUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 text-sm font-semibold transition-all active:scale-95 backdrop-blur-md"
              >
                <span>{secondaryCtaText}</span>
              </Link>
            </div>

          </div>

        </div>

        {/* 2. Mobile & Tablet Layout (Stacked: Image on top, text below) */}
        <div className="block lg:hidden rounded-3xl overflow-hidden bg-[#24070D] border border-amber-500/30 shadow-2xl">
          
          {/* Mobile Image: Family clearly visible without text obstruction */}
          <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] overflow-hidden bg-stone-900">
            <Image
              src={image}
              alt={`${title} - Maha Sell Family Shopping`}
              fill
              priority
              className="object-cover object-[72%_center]"
              sizes="100vw"
            />
            {/* Subtle bottom fade to blend with card */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#24070D] to-transparent" />
          </div>

          {/* Mobile Content Card */}
          <div className="p-6 sm:p-8 text-white space-y-4">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs uppercase font-bold tracking-widest w-fit">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{badge}</span>
            </div>

            {/* Campaign Heading */}
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium leading-[1.15] text-[#FAF7F2]">
              {title}
            </h2>

            {/* Subheading */}
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
              {subtitle}
            </p>

            {/* Trust Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] sm:text-xs text-amber-200/90">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-amber-500/20">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Genuine & Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-amber-500/20">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Best Mega Wholesale Prices</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-lg active:scale-95"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={secondaryCtaUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold active:scale-95 text-center"
              >
                <span>{secondaryCtaText}</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
