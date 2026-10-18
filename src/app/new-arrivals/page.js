import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export const metadata = {
  title: "New Arrivals • Latest Trending Collections",
  description: "Shop freshly arrived styles across Men's Wear, Women's Fashion, Kids' Wear and Footwear with mega wholesale savings on Maha Sell.",
  alternates: {
    canonical: "https://mahasell.in/new-arrivals",
  },
  openGraph: {
    title: "New Arrivals • Latest Trending Collections | Maha Sell",
    description: "Shop freshly arrived styles across Men's Wear, Women's Fashion, Kids' Wear and Footwear with mega wholesale savings on Maha Sell.",
    url: "https://mahasell.in/new-arrivals",
    siteName: "Maha Sell",
    images: ["https://ik.imagekit.io/mahasell/mainhero.webp"],
  },
};

export default function NewArrivalsPage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="New Arrivals • Latest Trending Styles"
        description="Discover freshly launched styles across Men's Wear, Women's Fashion, Kids' Wear and Footwear at unbeatable mega discounts."
        bannerImage="https://ik.imagekit.io/mahasell/mainhero.webp"
        filterType="new"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "New Arrivals", href: "/new-arrivals" },
        ]}
      />
      <Footer />
    </>
  );
}
