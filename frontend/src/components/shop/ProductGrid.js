"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Image as ImageIcon, ShoppingBag } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { normalizeTag, tagDisplayName } from "@/lib/productTags";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function ProductCard({ product }) {
  const primaryImage = product.images?.[0];

  return (
    <Link href={`/product/${product._id}`} className="group block rounded-[28px] border border-[#eadfce] bg-white overflow-hidden shadow-[0_18px_40px_rgba(115,80,60,0.06)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] bg-[#f6eee4] overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#b59a86]">
            <ImageIcon size={42} />
          </div>
        )}

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex-1 rounded-full bg-[#7a5641] px-4 py-3 text-sm font-medium text-white shadow-lg">
            <span className="inline-flex items-center justify-center gap-2">
              <ShoppingBag size={16} />
              View Product
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-[17px] font-medium text-[#3f2a20]">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7e6554]">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f7efe5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8d6f5a]"
            >
              {tagDisplayName(tag)}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-sm text-[#8f7767]">In stock: {product.stock}</p>
            <p className="text-lg font-semibold text-[#3f2a20]">{currencyFormatter.format(product.price || 0)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CollectionProductCard({ product }) {
  const primaryImage = product.images?.[0];
  const hasSalePrice = Number(product.originalPrice) > Number(product.price);

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-[18px] bg-[#f6eee4] shadow-[0_12px_28px_rgba(115,80,60,0.08)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#b59a86]">
              <ImageIcon size={40} />
            </div>
          )}

          {hasSalePrice && (
            <span className="absolute left-4 top-4 rounded-full bg-[#e73379] px-3 py-1 text-xs font-semibold text-white">
              -
              {Math.round(
                ((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100
              )}
              %
            </span>
          )}
        </div>
      </div>

      <div className="px-1 pt-4">
        <h3 className="line-clamp-2 text-[15px] leading-6 text-[#2e221d]">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-[#e73379]">{currencyFormatter.format(product.price || 0)}</span>
          {product.originalPrice && (
            <span className="text-[14px] text-[#8f7767] line-through">
              {currencyFormatter.format(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductGrid({ initialTag, onCountChange, variant = "shop" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "latest";
  const tagsFromUrl = searchParams.get("tags") || "";
  const view = searchParams.get("view") || "grid";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const mergedTags = new Set();

        if (initialTag) {
          mergedTags.add(normalizeTag(initialTag));
        }

        tagsFromUrl
          .split(",")
          .map((tag) => normalizeTag(tag))
          .filter(Boolean)
          .forEach((tag) => mergedTags.add(tag));

        const url = new URL(apiUrl("/api/products"));

        const finalTags = Array.from(mergedTags);
        if (finalTags.length > 0) {
          url.searchParams.set("tags", finalTags.join(","));
        }

        if (sort) {
          url.searchParams.set("sort", sort);
        }

        if (search) {
          url.searchParams.set("search", search);
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
        onCountChange?.(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
        onCountChange?.(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialTag, tagsFromUrl, sort, search, onCountChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#7a5641]" size={32} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#dbcab9] bg-white px-6 py-20 text-center text-[#8c7361]">
        No products found for the selected filters.
      </div>
    );
  }

  if (variant === "collection") {
    if (view === "list" || view === "detail") {
      return (
        <section className="space-y-5">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="group flex gap-4 rounded-[22px] border border-[#eadfce] bg-white p-4 shadow-[0_12px_28px_rgba(115,80,60,0.06)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-[150px] w-[120px] shrink-0 overflow-hidden rounded-[16px] bg-[#f6eee4]">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#b59a86]">
                    <ImageIcon size={34} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 py-1">
                <h3 className="line-clamp-2 text-[16px] leading-6 text-[#2e221d]">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#7e6554]">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#e73379]">
                    {currencyFormatter.format(product.price || 0)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[14px] text-[#8f7767] line-through">
                      {currencyFormatter.format(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      );
    }

    return (
      <section className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <CollectionProductCard key={product._id} product={product} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </section>
  );
}
