import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export const metadata = {
  title: "Bestsellers • Most Popular Products & Deals",
  description: "Explore India's most loved and highest-rated trending fashion, footwear and festive styles at wholesale prices on Maha Sell.",
  alternates: {
    canonical: "https://mahasell.in/bestsellers",
  },
  openGraph: {
    title: "Bestsellers • Most Popular Products | Maha Sell",
    description: "Explore India's most loved and highest-rated trending fashion, footwear and festive styles at wholesale prices on Maha Sell.",
    url: "https://mahasell.in/bestsellers",
    siteName: "Maha Sell",
    images: ["https://ik.imagekit.io/mahasell/mainhero.webp"],
  },
};

export default function BestsellersPage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="Bestsellers • Top Trending Deals"
        description="Explore India's most loved and highest-rated trending fashion, footwear and festive styles at wholesale prices."
        bannerImage="https://ik.imagekit.io/mahasell/mainhero.webp"
        filterType="bestseller"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Bestsellers", href: "/bestsellers" },
        ]}
      />
      <Footer />
    </>
  );
}
