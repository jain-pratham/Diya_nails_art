"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PLPHeader from "./PLPHeader";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import { normalizeTag } from "@/lib/productTags";

export default function ProductBrowser({
  title,
  subtitle,
  initialTag,
  variant = "shop",
}) {
  const [productCount, setProductCount] = useState(0);
  const [bootTag, setBootTag] = useState(initialTag ? normalizeTag(initialTag) : null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!bootTag) return;

    const existingTags = (searchParams.get("tags") || "")
      .split(",")
      .map((tag) => normalizeTag(tag))
      .filter(Boolean);

    if (existingTags.includes(bootTag)) {
      setBootTag(null);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("tags", [...existingTags, bootTag].join(","));
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }, [bootTag, pathname, router, searchParams]);

  return (
    <div className="min-h-screen bg-[#fcf7f0]">
      <PLPHeader
        title={title}
        subtitle={subtitle}
        productCount={productCount}
        compact={variant === "collection"}
      />

      <div className={`mx-auto max-w-[1440px] px-6 ${variant === "collection" ? "py-6 lg:px-8" : "py-10 lg:px-10"}`}>
        <div className={`grid gap-8 ${variant === "collection" ? "lg:grid-cols-[290px_minmax(0,1fr)]" : "lg:grid-cols-[300px_minmax(0,1fr)]"}`}>
          <aside className="hidden lg:block sticky top-24 self-start">
            <FilterSidebar compact={variant === "collection"} />
          </aside>

          <main>
            <Suspense fallback={<div className="py-20 text-center text-[#7e6554]">Loading products...</div>}>
              <ProductGrid
                initialTag={bootTag}
                onCountChange={setProductCount}
                variant={variant === "collection" ? "collection" : "shop"}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
