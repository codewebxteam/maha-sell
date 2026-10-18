import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { FABRIC_META } from "@/data/products";

export async function generateMetadata({ params }) {
  const { fabric } = await params;
  const meta = FABRIC_META[fabric] || {
    name: `${fabric ? fabric.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Fabric"} Collections`,
    description: "Explore premium fabric collections crafted with verified top-grade materials at wholesale rates.",
  };
  const title = `${meta.name} | Maha Sell`;
  return {
    title,
    description: meta.description,
    alternates: {
      canonical: `https://mahasell.in/collections/fabric/${fabric}`,
    },
    openGraph: {
      title,
      description: meta.description,
      url: `https://mahasell.in/collections/fabric/${fabric}`,
    },
  };
}

export default async function FabricPage({ params }) {
  const { fabric } = await params;
  const meta = FABRIC_META[fabric] || {
    name: `${fabric.replace("-", " ").toUpperCase()} Wear`,
    description: "Authentic pure weave textiles crafted with certified materials.",
    banner: "/banners/hero-3.png",
  };

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-3.png"}
        filterType="fabric"
        filterValue={fabric}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Fabrics", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/fabric/${fabric}` },
        ]}
      />
      <Footer />
    </>
  );
}
