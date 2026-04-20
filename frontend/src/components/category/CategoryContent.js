"use client";

import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import PLPHeader from "@/components/shop/PLPHeader";
import { Suspense, useState } from "react";

export default function CategoryContent({ slug }) {
  const [productCount, setProductCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      {/* Page title + sticky toolbar */}
      <PLPHeader productCount={productCount} />

      {/* Main content: sidebar + grid */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 pb-24">
        <div className="flex gap-8 xl:gap-12 items-start">

          {/* Sticky Filter Sidebar */}
          <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 sticky top-[56px] self-start">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="flex justify-center p-10">Loading products...</div>}>
              <ProductGrid initialTag={slug} onCountChange={setProductCount} />
            </Suspense>
          </main>

        </div>
      </div>
    </div>
  );
}
