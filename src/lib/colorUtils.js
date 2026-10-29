/**
 * Color mapping and product color extractor
 * Strictly returns only colors actually provided for the product (No hardcoded demo colors).
 */

export const COLOR_HEX_MAP = {
  "red": "#DC2626",
  "crimson": "#B91C1C",
  "crimson red": "#B91C1C",
  "maroon": "#571520",
  "royal maroon": "#3E0C15",
  "wine": "#4A0E17",
  "royal wine": "#4A0E17",
  "pink": "#EC4899",
  "rani pink": "#BE185D",
  "baby pink": "#FBCFE8",
  "rose": "#F43F5E",
  "blue": "#2563EB",
  "navy": "#1E3A8A",
  "navy blue": "#1E3A8A",
  "midnight navy": "#1A2A6C",
  "midnight blue": "#1A2A6C",
  "royal blue": "#1D4ED8",
  "sky blue": "#38BDF8",
  "green": "#16A34A",
  "emerald": "#0D593F",
  "emerald green": "#0D593F",
  "bottle green": "#064E3B",
  "olive": "#65A30D",
  "mint green": "#6EE7B7",
  "yellow": "#EAB308",
  "lemon yellow": "#FDE047",
  "mustard": "#CA8A04",
  "mustard yellow": "#CA8A04",
  "gold": "#D4AF37",
  "antique gold": "#D4AF37",
  "golden": "#D4AF37",
  "orange": "#F97316",
  "rust": "#C2410C",
  "purple": "#9333EA",
  "royal purple": "#6A1B9A",
  "lavender": "#C084FC",
  "violet": "#7C3AED",
  "black": "#18181B",
  "jet black": "#09090B",
  "white": "#FFFFFF",
  "off white": "#FAF7F2",
  "cream": "#FEF3C7",
  "beige": "#D6C7B2",
  "grey": "#71717A",
  "gray": "#71717A",
  "silver": "#E2E8F0",
  "brown": "#78350F",
  "peach": "#FDBA74",
  "teal": "#0D9488",
  "turquoise": "#06B6D4",
  "magenta": "#D946EF",
  "coral": "#FB7185",
  "multicolor": "linear-gradient(135deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6)",
  "multi": "linear-gradient(135deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6)"
};

export function getColorHex(colorName, fallback = "#3E0C15") {
  if (!colorName) return fallback;
  const clean = String(colorName).trim().toLowerCase();
  return COLOR_HEX_MAP[clean] || fallback;
}

/**
 * Extracts and returns ONLY the colors that were actually assigned to this product.
 * Returns empty array [] if no color is specified (avoids hardcoded fake demo swatches).
 */
export function getProductColors(product) {
  if (!product) return [];

  // 1. Explicit colors array in product
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    return product.colors
      .map((c) => {
        if (typeof c === "string") {
          const trimmed = c.trim();
          if (!trimmed || trimmed.toLowerCase() === "primary" || trimmed.toLowerCase() === "default") {
            return null;
          }
          return { name: trimmed, hex: getColorHex(trimmed) };
        }
        if (c && typeof c === "object" && c.name) {
          const trimmed = c.name.trim();
          if (!trimmed || trimmed.toLowerCase() === "primary" || trimmed.toLowerCase() === "default") {
            return null;
          }
          return { name: trimmed, hex: c.hex || getColorHex(trimmed) };
        }
        return null;
      })
      .filter(Boolean);
  }

  // 2. Explicit colorVariants array in product
  if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
    return product.colorVariants
      .map((c) => {
        if (!c || !c.name) return null;
        const trimmed = c.name.trim();
        if (!trimmed || trimmed.toLowerCase() === "primary" || trimmed.toLowerCase() === "default") {
          return null;
        }
        return { name: trimmed, hex: c.hex || getColorHex(trimmed) };
      })
      .filter(Boolean);
  }

  // 3. String field: colorName or color
  const rawColor = product.colorName || product.color;
  if (rawColor && typeof rawColor === "string") {
    const trimmed = rawColor.trim();
    // Ignore placeholder defaults
    if (!trimmed || trimmed.toLowerCase() === "primary" || trimmed.toLowerCase() === "default") {
      return [];
    }

    // Handle comma or slash separated list, e.g. "Multicolor, Rani Pink"
    if (trimmed.includes(",") || trimmed.includes("/")) {
      const parts = trimmed.split(/[,/]+/).map((s) => s.trim()).filter(Boolean);
      return parts.map((p) => ({
        name: p,
        hex: getColorHex(p, product.colorHex || "#3E0C15")
      }));
    }

    return [{
      name: trimmed,
      hex: product.colorHex || getColorHex(trimmed)
    }];
  }

  return [];
}
