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
    <section className="w-full py-12 md:py-16 bg-white overflow-hidden">
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
            className="flex gap-4 sm:gap-[30px] overflow-x-auto snap-x snap-mandatory w-full hide-scrollbar [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[330px] snap-start cursor-pointer group/card pb-4"
                  >
                    <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[330px] md:h-[330px] rounded-2xl overflow-hidden mb-4 bg-gray-100 animate-pulse" />
                    <div className="px-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))
              : products.map((product) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[330px] snap-start cursor-pointer group/card pb-4"
                  >
                    <Link href={`/product/${product._id}`} className="block">
                      <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[330px] md:h-[330px] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                        {product.discount && (
                          <div className="absolute top-3 left-3 z-10 bg-[#C181C8] bg-opacity-90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {product.discount}
                          </div>
                        )}

                        <div className="w-full h-full group-hover/card:scale-105 transition-transform duration-500">
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
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#9ABAE8] to-[#C181C8] opacity-50"></div>
                        </div>
                      </div>

                      <div className="px-1">
                        <h3 className="text-[13px] sm:text-[13.5px] text-[#555555] font-normal leading-relaxed mb-1 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[12px] sm:text-[13px]">
                          <span className="text-[#C181C8] font-semibold">
                            {currencyFormatter.format(product.price || 0)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 text-[11px] line-through">
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
