import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export const metadata = {
  title: "All Categories & Collections | Wholesale Mega Deals",
  description: "Browse all trending collections on Maha Sell across Men's Wear, Women's Fashion, Kids' Clothing & Footwear with up to 80% discount and express delivery.",
  alternates: {
    canonical: "https://mahasell.in/collections",
  },
  openGraph: {
    title: "All Categories & Collections | Maha Sell",
    description: "Browse all trending collections on Maha Sell across Men's Wear, Women's Fashion, Kids' Clothing & Footwear.",
    url: "https://mahasell.in/collections",
    siteName: "Maha Sell",
    images: ["https://ik.imagekit.io/mahasell/mainhero.webp"],
  },
};

export default function CollectionsOverviewPage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="All Collections & Products"
        description="Explore trending products across Men's Wear, Women's Fashion, Kids' Wear & Footwear at India's best mega prices."
        bannerImage="https://ik.imagekit.io/mahasell/mainhero.webp"
        filterType="all"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Categories & Collections", href: "/collections" },
        ]}
      />
      <Footer />
    </>
  );
}
