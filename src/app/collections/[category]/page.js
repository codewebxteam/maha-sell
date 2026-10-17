import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductListingPage from "@/components/ProductListingPage";
import { CATEGORY_META, OCCASION_META } from "@/data/products";

export default async function CategoryPage({ params }) {
  const { category } = await params;

  // Support category slugs or occasion direct aliases like /collections/wedding
  const isOccasion = Boolean(OCCASION_META[category]);
  const meta = isOccasion 
    ? OCCASION_META[category] 
    : (CATEGORY_META[category] || {
        name: category === "sarees" ? "Sarees Collection" : `${category.replace("-", " ").toUpperCase()}`,
        description: "Discover trending products with guaranteed quality at India's best prices.",
        banner: "https://ik.imagekit.io/mahasell/mainhero.webp",
      });

  const isAll = category === "sarees" || category === "all";

  return (
    <>
      <Navbar />
      <ProductListingPage
        title={meta.name}
        description={meta.description}
        bannerImage={meta.banner || "https://ik.imagekit.io/mahasell/mainhero.webp"}
        filterType={isAll ? "all" : isOccasion ? "occasion" : "category"}
        filterValue={isAll ? null : category}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Collections", href: "/collections" },
          { name: meta.name, href: `/collections/${category}` },
        ]}
      />
      <Footer />
    </>
  );
}
