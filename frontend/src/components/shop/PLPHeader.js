"use client";

import { useEffect, useState } from "react";
import { Filter, Grid2x2, LayoutGrid, List, Rows3, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PLPHeader({
  title = "Shop Nails",
  subtitle = "Browse handcrafted press-on sets by the tags that matter most.",
  productCount = 0,
  onOpenMobileFilters,
  compact = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const view = searchParams.get("view") || "grid";

  const sort = searchParams.get("sort") || "latest";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (compact) return undefined;

    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [compact]);

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <>
      {compact ? (
        <div className="border-b border-[#eadfce] bg-[linear-gradient(180deg,#fcf7f0_0%,#f8f1e7_100%)] px-6 py-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">
                Diya&apos;s Nail Art
              </p>
              <h1 className="mt-3 text-3xl font-light tracking-tight text-[#3f2a20] md:text-5xl">
                {title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#7e6554] md:text-base">
                {subtitle}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#7e6554]">
                <span>
                  There are <span className="font-medium text-[#3f2a20]">{productCount}</span> results in total
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 lg:justify-end">
                <div className="hidden items-center gap-1 rounded-full border border-[#eadfce] bg-white p-1 md:flex">
                  <button
                    type="button"
                    onClick={() => updateQuery("view", "grid")}
                    className={`rounded-full p-2 transition-colors ${
                      view === "grid" ? "bg-[#7a5641] text-white" : "text-[#a8836e]"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid2x2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuery("view", "tight")}
                    className={`rounded-full p-2 transition-colors ${
                      view === "tight" ? "bg-[#7a5641] text-white" : "text-[#a8836e]"
                    }`}
                    aria-label="Tight grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuery("view", "list")}
                    className={`rounded-full p-2 transition-colors ${
                      view === "list" ? "bg-[#7a5641] text-white" : "text-[#a8836e]"
                    }`}
                    aria-label="List view"
                  >
                    <Rows3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuery("view", "detail")}
                    className={`rounded-full p-2 transition-colors ${
                      view === "detail" ? "bg-[#7a5641] text-white" : "text-[#a8836e]"
                    }`}
                    aria-label="Detailed list view"
                  >
                    <List size={15} />
                  </button>
                </div>

                <label className="flex items-center gap-2 text-sm text-[#7e6554]">
                  <span className="whitespace-nowrap">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(event) => updateQuery("sort", event.target.value)}
                    className="appearance-none rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-medium text-[#3f2a20] outline-none"
                  >
                    <option value="latest">Newest</option>
                    <option value="price_asc">Price low to high</option>
                    <option value="price_desc">Price high to low</option>
                    <option value="best_selling">Best selling</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className="border-b border-[#eadfce] bg-[linear-gradient(180deg,#fcf7f0_0%,#f8f1e7_100%)] px-6 py-14 lg:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">
                Diya&apos;s Nail Art
              </p>
              <h1 className="mt-4 text-4xl font-light tracking-tight text-[#3f2a20] md:text-6xl">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#7e6554] md:text-lg">
                {subtitle}
              </p>
            </div>
          </section>

          <div
            className={`sticky top-0 z-30 border-b px-6 py-4 lg:px-10 ${
              isScrolled
                ? "border-[#eadfce] bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(115,80,60,0.06)]"
                : "border-transparent bg-[#fcf7f0]"
            }`}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenMobileFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-medium text-[#3f2a20] md:hidden"
                >
                  <Filter size={14} />
                  Filters
                </button>
                <p className="text-sm text-[#7e6554]">
                  Showing <span className="font-medium text-[#3f2a20]">{productCount}</span> products
                </p>
              </div>

              <div className="flex flex-1 items-center gap-3 md:max-w-2xl md:justify-end">
                <div className="relative flex-1 md:max-w-md">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => updateQuery("search", event.target.value)}
                    placeholder="Search products"
                    className="w-full rounded-full border border-[#eadfce] bg-white px-5 py-2.5 pr-11 text-sm text-[#3f2a20] outline-none placeholder:text-[#a68b79] focus:border-[#c9b29f]"
                  />
                  <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#a8836e]" size={14} />
                </div>

                <select
                  value={sort}
                  onChange={(event) => updateQuery("sort", event.target.value)}
                  className="appearance-none rounded-full border border-[#eadfce] bg-white px-4 py-2.5 text-sm font-medium text-[#3f2a20] outline-none"
                >
                  <option value="latest">Newest</option>
                  <option value="price_asc">Price low to high</option>
                  <option value="price_desc">Price high to low</option>
                  <option value="best_selling">Best selling</option>
                </select>

                <div className="hidden items-center rounded-full border border-[#eadfce] bg-white p-1 md:flex">
                  <button
                    type="button"
                    onClick={() => updateQuery("view", "grid")}
                    className={`rounded-full p-2 ${
                      view === "grid" ? "bg-[#7a5641] text-white" : "text-[#a8836e]"
                    }`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuery("view", "list")}
                    className={`rounded-full p-2 ${
                      view === "list" ? "bg-[#7a5641] text-white" : "text-[#a8836e]"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
