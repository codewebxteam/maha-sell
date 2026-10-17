import Link from "next/link";

/**
 * Maha Sell Luxury Heritage Brand Logo & Emblem Component
 * 
 * The emblem represents:
 * - The iconic royal letter "M" crafted with geometric gold crest lines (महा सेल)
 * - An authentic royal diamond seal & crown flourish
 * - A symbol of trust, quality, and mega savings
 */
export function MahaSellEmblem({ size = 38, variant = "maroon", className = "" }) {
  const isLight = variant === "light";

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-label="Maha Sell Royal Crest Emblem"
    >
      <defs>
        {/* Luxury Gold Linear Gradient */}
        <linearGradient id="sbGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9E7D2E" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="55%" stopColor="#FFF2D6" />
          <stop offset="80%" stopColor="#C5A049" />
          <stop offset="100%" stopColor="#8A6820" />
        </linearGradient>

        {/* Deep Royal Maroon Gradient */}
        <linearGradient id="sbMaroon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#571520" />
          <stop offset="50%" stopColor="#3E0C15" />
          <stop offset="100%" stopColor="#24070D" />
        </linearGradient>

        {/* Glow Filter for Gold Accents */}
        <filter id="sbGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#D4AF37" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 1. Outer Royal Heritage Diamond / Medallion Ring */}
      <rect 
        x="12" 
        y="12" 
        width="76" 
        height="76" 
        rx="22" 
        transform="rotate(45 50 50)" 
        fill={isLight ? "rgba(255, 255, 255, 0.08)" : "#FAF7F2"} 
        stroke="url(#sbGold)" 
        strokeWidth="2.5" 
        strokeDasharray="4 2"
      />

      {/* 2. Inner Solid Crest Shield */}
      <rect 
        x="18" 
        y="18" 
        width="64" 
        height="64" 
        rx="18" 
        transform="rotate(45 50 50)" 
        fill={isLight ? "#24070D" : "url(#sbMaroon)"} 
        stroke="url(#sbGold)" 
        strokeWidth="1.5" 
        filter="url(#sbGlow)"
      />

      {/* 3. Royal Stylized "M" for Maha Sell */}
      <g stroke="url(#sbGold)" strokeLinecap="round" strokeLinejoin="round" fill="none">
        
        {/* Main 'M' Silhouette: Left stem, center peak/v, right stem */}
        <path 
          d="M 32 66 L 32 37 L 50 56 L 68 37 L 68 66" 
          strokeWidth="3.4" 
        />

        {/* Inner gold shimmer accent line */}
        <path 
          d="M 36 64 L 36 41 L 50 58 L 64 41 L 64 64" 
          strokeWidth="1.2" 
          strokeOpacity="0.85" 
        />

        {/* Traditional Diamond Accent at Center Bottom */}
        <path 
          d="M 50 63 L 53.5 67.5 L 50 72 L 46.5 67.5 Z" 
          fill="url(#sbGold)" 
          strokeWidth="0.8" 
        />

        {/* Top Royal Crown / Star Crest */}
        <path 
          d="M 50 20 C 50 24, 53 27, 57 27 C 53 27, 50 30, 50 34 C 50 30, 47 27, 43 27 C 47 27, 50 24, 50 20 Z" 
          fill="url(#sbGold)" 
          stroke="none" 
        />
      </g>
    </svg>
  );
}

// Keep backwards-compatible aliases
export const SuratbazarEmblem = MahaSellEmblem;
export const VastraEmblem = MahaSellEmblem;

export default function MahaSellLogo({ 
  variant = "dark", // "dark" (for light navbar background) | "light" (for dark footer background)
  size = "default", // "compact", "default", "large"
  showTagline = true,
  className = "" 
}) {
  const isLight = variant === "light";
  const emblemSize = size === "compact" ? 30 : size === "large" ? 44 : 38;

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-2 sm:gap-2.5 group select-none ${className}`}
      aria-label="Maha Sell - Home"
    >
      {/* Royal Maha Sell "M" Emblem */}
      <MahaSellEmblem size={emblemSize} variant={isLight ? "light" : "maroon"} />

      {/* Brand Text Block */}
      <div className="flex flex-col text-left">
        <span 
          className={`font-serif-luxury font-bold uppercase tracking-[0.14em] sm:tracking-[0.20em] transition-colors leading-none whitespace-nowrap ${
            size === "compact" 
              ? "text-lg sm:text-2xl" 
              : size === "large" 
                ? "text-2xl sm:text-3xl md:text-4xl" 
                : "text-xl sm:text-2xl md:text-3xl"
          } ${
            isLight 
              ? "text-white group-hover:text-amber-300" 
              : "text-[#3E0C15] group-hover:text-amber-800"
          }`}
        >
          Maha Sell
        </span>
        {showTagline && (
          <span 
            className={`uppercase tracking-[0.24em] sm:tracking-[0.32em] font-semibold mt-0.5 sm:mt-1 transition-colors whitespace-nowrap ${
              size === "compact" ? "text-[6.5px] sm:text-[7.5px]" : "text-[7.5px] sm:text-[9px]"
            } ${
              isLight ? "text-amber-400/90" : "text-[#8C7355]"
            }`}
          >
            Mega Deals • Maha Savings
          </span>
        )}
      </div>
    </Link>
  );
}

// Backwards compatibility aliases so all components work seamlessly
export const SuratbazarLogo = MahaSellLogo;
export const VastraLogo = MahaSellLogo;
