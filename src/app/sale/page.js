import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";

export const metadata = {
  title: "Mega Sale & Special Offers • Flat 50% - 80% Off",
  description: "Grab biggest discounts during Maha Mega Sale across Men's, Women's, Kids' Fashion and Footwear. Genuine products at direct wholesale prices.",
  alternates: {
    canonical: "https://mahasell.in/sale",
  },
  openGraph: {
    title: "Mega Sale & Special Offers • Flat 50% - 80% Off | Maha Sell",
    description: "Grab biggest discounts during Maha Mega Sale across Men's, Women's, Kids' Fashion and Footwear.",
    url: "https://mahasell.in/sale",
    siteName: "Maha Sell",
    images: ["https://ik.imagekit.io/mahasell/mainhero.webp"],
  },
};

export default function SalePage() {
  return (
    <>
      <Navbar />
      <ProductListingPage
        title="Mega Sale & Special Offers"
        description="Unbeatable wholesale discounts up to 80% off across Men's Wear, Women's Fashion, Kids & Footwear. Limited seasonal stock."
        bannerImage="https://ik.imagekit.io/mahasell/mainhero.webp"
        filterType="sale"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Mega Sale", href: "/sale" },
        ]}
      />
      <Footer />
    </>
  );
}
