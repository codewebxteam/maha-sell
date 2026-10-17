import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, RotateCcw, Tag, ArrowRight } from "lucide-react";

export default function BrandStory() {
  const perks = [
    {
      icon: Tag,
      title: "Mega Savings & Wholesale Rates",
      desc: "Direct-from-source sourcing ensures lowest prices and up to 80% off daily."
    },
    {
      icon: ShieldCheck,
      title: "100% Original Products",
      desc: "Every item undergoes rigorous quality inspections before dispatch."
    },
    {
      icon: Truck,
      title: "Fast Delivery Across India",
      desc: "Express doorstep delivery servicing 19,000+ pin codes nationwide."
    },
    {
      icon: RotateCcw,
      title: "Easy 7-Day Returns",
      desc: "Hassle-free exchange & refund support with dedicated customer care."
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          {/* Left Visual Artwork */}
          <div className="relative w-full">
            <div className="relative h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-amber-900/15 group bg-stone-100">
              <Image
                src="https://ik.imagekit.io/mahasell/section2.webp"
                alt="Maha Sell Multi-Category Shopping - Men, Women, Kids & Footwear"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Subtle top floating badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2D0A10]/80 backdrop-blur-md border border-amber-400/30 text-amber-200 text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>All-in-One Emporium</span>
              </div>
            </div>
          </div>

          {/* Right Information & Perks */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#9E7D2E] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Shop At Maha Sell</span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2D0A10] leading-tight">
              India&apos;s Ultimate Mega Savings Shopping Destination
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              At <strong className="text-stone-950 font-bold">Maha Sell</strong>, we bring you trending collections across Men&apos;s Wear, Women&apos;s Wear, Kids&apos; Wear, and Footwear with mega discounts and unmatched convenience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {perks.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                    <Icon className="w-5 h-5 text-[#9E7D2E] mb-1.5" />
                    <h5 className="text-sm font-bold text-stone-900">{p.title}</h5>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#3E0C15] hover:bg-[#571520] text-[#F7EFCF] text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-95 group"
              >
                <span>Explore All Categories</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
