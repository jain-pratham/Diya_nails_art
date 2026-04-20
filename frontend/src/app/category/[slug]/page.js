import ProductBrowser from "@/components/shop/ProductBrowser";
import { tagDisplayName, normalizeTag } from "@/lib/productTags";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = normalizeTag(slug);
  const displayName = tagDisplayName(tag);

  return {
    title: `${displayName} Nails | Diya's Nail Art`,
    description: `Shop press-on nails tagged ${displayName}.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#7e6554]">Loading category...</div>}>
      <ProductBrowser
        title={`${tagDisplayName(slug)} Nails`}
        subtitle={`All products tagged with ${tagDisplayName(slug).toLowerCase()}.`}
        initialTag={slug}
        variant="collection"
      />
    </Suspense>
  );
}
