"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, href }) {
  const productHref = href || (product?._id ? `/product/${product._id}` : "#");
  const imageSrc = product.image || product.images?.[0] || "/hero1.png";

  return (
    <Link href={productHref} className="block w-full">
      <div className="group/card flex w-full flex-col">
        <div className="relative mb-3 w-full aspect-square overflow-hidden rounded-[1.35rem] sm:rounded-[1.75rem] bg-[#F8F1E7]">
          {product.discount && (
            <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#b39178] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
              {product.discount}
            </div>
          )}
          <div className="h-full w-full transition-transform duration-500 group-hover/card:scale-[1.03]">
            <Image
              src={imageSrc}
              fill
              className="relative z-10 object-cover"
              alt={product.name}
              unoptimized
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f2218]/6 via-transparent to-white/10" />
          </div>
        </div>

        <div className="px-0.5">
          <h3 className="mb-1.5 line-clamp-2 text-[13px] font-medium leading-[1.4] text-[#3f2a20] sm:text-[14px]">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] sm:text-[14px]">
            <span className="font-semibold text-[#B39178]">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through sm:text-xs">{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
