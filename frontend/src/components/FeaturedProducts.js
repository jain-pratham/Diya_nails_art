"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { apiUrl } from "@/lib/api";

export default function FeaturedProducts({
  title = "Featured Products",
  viewAllHref = "/shop",
  limit = 8,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl("/api/products"));
        const data = await response.json();
        setProducts(Array.isArray(data) ? data.slice(0, limit) : []);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  const viewProducts = loading ? [] : products;

  return (
    <section className="w-full py-14 md:py-20 bg-white">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-10">
          <h2 className="text-[1.65rem] sm:text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight leading-tight">
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="text-sm text-gray-500 hover:text-[#B39178] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            View All <ChevronRight size={14} className="text-gray-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
          {loading
            ? Array.from({ length: limit }).map((_, index) => (
                <div key={index} className="w-full flex flex-col cursor-pointer group/card">
                  <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden mb-4 bg-[#F8F1E7] animate-pulse" />
                  <div className="px-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))
            : viewProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  href={`/product/${product._id}`}
                  product={{
                    ...product,
                    image: product.images?.[0] || "/hero1.png",
                    price: product.price ? `₹ ${product.price.toFixed(0)}` : "₹ 0",
                  }}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
