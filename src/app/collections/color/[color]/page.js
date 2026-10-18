import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { COLOR_META } from "@/data/products";

export async function generateMetadata({ params }) {
  const { color } = await params;
  const meta = COLOR_META[color] || {
    name: `${color ? color.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Color"} Styles`,
    description: "Discover trending styles in vibrant colorways at mega discount wholesale rates.",
  };
  const title = `${meta.name} | Maha Sell`;
  return {
    title,
    description: meta.description,
    alternates: {
      canonical: `https://mahasell.in/collections/color/${color}`,
    },
    openGraph: {
      title,
      description: meta.description,
      url: `https://mahasell.in/collections/color/${color}`,
    },
  };
}

export default async function ColorPage({ params }) {
  const { color } = await params;
  const meta = COLOR_META[color] || {
    name: `${color.replace("-", " ").toUpperCase()} Styles`,
    description: "Discover trending styles in vibrant colorways at wholesale rates.",
    banner: "/banners/hero-4.png",
  };

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "/banners/hero-4.png"}
        filterType="color"
        filterValue={color}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Colours", href: "/collections/sarees" },
          { name: meta.name, href: `/collections/color/${color}` },
        ]}
      />
      <Footer />
    </>
  );
}
