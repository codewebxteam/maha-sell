import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

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
