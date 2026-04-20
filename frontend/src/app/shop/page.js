import ProductBrowser from "@/components/shop/ProductBrowser";
import { Suspense } from "react";

export const metadata = {
  title: "Shop Nails | Diya's Nail Art",
  description: "Browse press-on nails by tag, finish, color, length, and occasion.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#7e6554]">Loading shop...</div>}>
      <ProductBrowser
        title="Shop the Collection"
        subtitle="Choose one or more tags to narrow down your perfect press-on set."
      />
    </Suspense>
  );
}
