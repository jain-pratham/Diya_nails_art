"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, href }) {
  const productHref = href || (product?._id ? `/product/${product._id}` : "#");
  const imageSrc = product.image || product.images?.[0] || "/hero1.png";

  return (
    <Link href={productHref} className="block w-full">
      <div className="w-full flex flex-col cursor-pointer group/card">
        <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-[1.25rem] sm:rounded-2xl overflow-hidden mb-3 md:mb-4 bg-[#F8F1E7]">
          {product.discount && (
            <div className="absolute top-3 left-3 z-10 bg-[#C181C8] bg-opacity-90 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.discount}
            </div>
          )}
          <div className="w-full h-full group-hover/card:scale-105 transition-transform duration-500">
            <Image
              src={imageSrc}
              fill
              className="object-cover relative z-10"
              alt={product.name}
              unoptimized
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#9ABAE8] to-[#C181C8] opacity-30"></div>
          </div>
        </div>

        <div className="px-1">
          <h3 className="text-[15px] sm:text-[14px] text-[#3f2a20] font-medium leading-snug mb-1.5 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-[13px] sm:text-[14px]">
            <span className="text-[#B39178] font-semibold">{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
