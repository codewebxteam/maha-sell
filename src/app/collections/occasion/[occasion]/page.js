import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { OCCASION_META } from "@/data/products";

export async function generateMetadata({ params }) {
  const { occasion } = await params;
  const meta = OCCASION_META[occasion] || {
    name: `${occasion ? occasion.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Occasion"} Collections`,
    description: "Curated collections styled for your special celebrations at unbeatable wholesale rates.",
  };
  const title = `${meta.name} | Maha Sell`;
  return {
    title,
    description: meta.description,
    alternates: {
      canonical: `https://mahasell.in/collections/occasion/${occasion}`,
    },
    openGraph: {
      title,
      description: meta.description,
      url: `https://mahasell.in/collections/occasion/${occasion}`,
    },
  };
}

export default async function OccasionPage({ params }) {
  const { occasion } = await params;
  const meta = OCCASION_META[occasion] || {
    name: `${occasion.replace("-", " ").toUpperCase()} Collections`,
    description: "Curated collections styled for your special celebrations at wholesale rates.",
    banner: "/banners/hero-2.png",
  };

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-2.png"}
        filterType="occasion"
        filterValue={occasion}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Occasions", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/occasion/${occasion}` },
        ]}
      />
      <Footer />
    </>
  );
}
