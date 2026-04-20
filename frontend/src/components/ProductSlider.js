"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductSlider({
  title = "French Press on Nails",
  tag = "french",
  viewAllHref = "/category/french",
  limit = 6,
}) {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = new URL(apiUrl("/api/products"));
        if (tag) {
          url.searchParams.set("tags", tag);
        }

        const response = await fetch(url.toString());
        const data = await response.json();
        setProducts(Array.isArray(data) ? data.slice(0, limit) : []);
      } catch (error) {
        console.error("Failed to fetch slider products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tag, limit]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let intervalId;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (!scrollContainer) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        const scrollAmount = 330 + 30;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }, 3000);
    };

    startAutoScroll();

    const pauseScroll = () => clearInterval(intervalId);
    const resumeScroll = () => startAutoScroll();

    scrollContainer.addEventListener("mouseenter", pauseScroll);
    scrollContainer.addEventListener("mouseleave", resumeScroll);
    scrollContainer.addEventListener("touchstart", pauseScroll);
    scrollContainer.addEventListener("touchend", resumeScroll);

    return () => {
      clearInterval(intervalId);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", pauseScroll);
        scrollContainer.removeEventListener("mouseleave", resumeScroll);
        scrollContainer.removeEventListener("touchstart", pauseScroll);
        scrollContainer.removeEventListener("touchend", resumeScroll);
      }
    };
  }, []);

  return (
    <section className="w-full overflow-hidden bg-white py-12 md:py-16">
      <div className="max-w-[1458px] mx-auto px-4 sm:px-6">
        <div className="max-w-[1410px] mx-auto flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight">
            {title}
          </h2>
          <Link href={viewAllHref} className="text-sm text-gray-500 hover:text-[#B39178] flex items-center gap-1 transition-colors self-start sm:self-auto">
            View All <ChevronRight size={14} className="text-gray-400" />
          </Link>
        </div>

        <div className="max-w-[1410px] mx-auto">
          <div
            ref={scrollRef}
            className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto hide-scrollbar [&::-webkit-scrollbar]:hidden sm:gap-[30px]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="group/card w-[44vw] min-w-[158px] max-w-[212px] flex-shrink-0 snap-start pb-4 sm:w-[280px] sm:max-w-none md:w-[330px]"
                  >
                    <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-[1.35rem] bg-gray-100 animate-pulse sm:mb-4 sm:rounded-[1.75rem]" />
                    <div className="space-y-2 px-0.5">
                      <div className="h-3.5 w-3/4 rounded bg-gray-100 animate-pulse" />
                      <div className="h-3.5 w-1/2 rounded bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))
              : products.map((product) => (
                  <div
                    key={product._id}
                    className="group/card w-[44vw] min-w-[158px] max-w-[212px] flex-shrink-0 snap-start pb-4 sm:w-[280px] sm:max-w-none md:w-[330px]"
                  >
                    <Link href={`/product/${product._id}`} className="block">
                      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-[1.35rem] bg-gray-100 sm:mb-4 sm:rounded-[1.75rem]">
                        {product.discount && (
                          <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#b39178] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
                            {product.discount}
                          </div>
                        )}

                        <div className="h-full w-full transition-transform duration-500 group-hover/card:scale-[1.03]">
                          <Image
                            src={product.images?.[0] || "/hero1.png"}
                            fill
                            className="object-cover relative z-10"
                            alt={product.name}
                            unoptimized
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2f2218]/6 via-transparent to-white/10"></div>
                        </div>
                      </div>

                      <div className="px-0.5">
                        <h3 className="mb-1 line-clamp-2 text-[13px] font-medium leading-[1.35] text-[#3f2a20] sm:text-[14px]">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px]">
                          <span className="font-semibold text-[#B39178]">
                            {currencyFormatter.format(product.price || 0)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
