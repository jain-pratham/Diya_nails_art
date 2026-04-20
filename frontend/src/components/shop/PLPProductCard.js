"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";

const BADGE_STYLES = {
  "Best Seller": "bg-[#AF8F75] text-white",
  New: "bg-[#73503C] text-white",
  Trending: "bg-[#E8D5C4] text-[#73503C]",
  Limited: "bg-[#333333] text-white",
};

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={product?._id ? `/product/${product._id}` : "#"}
      className="group relative block bg-white rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(115,80,60,0.06)] hover:shadow-[0_12px_40px_rgba(115,80,60,0.15)] transition-all duration-500 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full aspect-[4/4.5] overflow-hidden bg-[#F7F1E5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          className={`object-cover transition-transform duration-700 ease-out ${hovered ? "scale-110" : "scale-100"}`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F1E5] to-[#E8D5C4] -z-10" />

        {product.badge && (
          <div
            className={`absolute top-4 left-4 z-10 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${BADGE_STYLES[product.badge] || "bg-white text-[#73503C]"}`}
          >
            {product.badge}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((w) => !w);
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${wishlisted ? "fill-[#AF8F75] text-[#AF8F75]" : "text-[#AF8F75]"}`}
          />
        </button>

        <div
          className={`absolute inset-x-4 bottom-4 z-10 transition-all duration-400 ease-out ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        >
          <div className="flex gap-2">
            <div className="flex-1 bg-[#73503C] hover:bg-[#AF8F75] text-white text-xs font-medium tracking-wider py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
              <ShoppingBag size={14} />
              View Product
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors text-[#73503C]">
              <Eye size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-[#333333] text-sm font-light leading-snug mb-2 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[#73503C] font-semibold text-base">{product.price}</span>
          {product.originalPrice && (
            <span className="text-[#AF8F75]/70 text-xs line-through">{product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="ml-auto text-[10px] font-semibold text-[#AF8F75] bg-[#AF8F75]/10 px-2 py-0.5 rounded-full">
              {product.discount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
