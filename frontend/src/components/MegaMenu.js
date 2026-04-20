"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PRODUCT_TAG_GROUPS } from "@/lib/productTags";

const menuColumns = [
  {
    title: "Shop By Category",
    items: [
      { label: "Best Sellers", href: "/shop?tags=best-sellers" },
      { label: "French nails", href: "/category/french" },
      { label: "Casual Wear Nails", href: "/category/casual" },
      { label: "Toe Nails", href: "/shop?tags=toe-nails" },
      { label: "Ombre Nails", href: "/category/ombre" },
    ],
  },
  {
    title: "Shop By Shape",
    items: [
      { label: "Coffin Nails", href: "/category/coffin" },
      { label: "Stiletto Nails", href: "/category/stiletto" },
      { label: "Square Nails", href: "/category/square" },
      { label: "Round Nails", href: "/category/round" },
      { label: "Almond Nails", href: "/category/almond" },
      { label: "Ballerina Nails", href: "/category/ballerina" },
    ],
  },
  {
    title: "Shop By Occasion",
    items: [
      { label: "Casual Nails", href: "/category/casual-nails" },
      { label: "Party Nails", href: "/category/party-nails" },
      { label: "Wedding Nails", href: "/category/bridal" },
      { label: "Formal Nails", href: "/category/formal-nails" },
      { label: "Holiday Nails", href: "/category/holiday-nails" },
    ],
  },
  {
    title: "Shop By Color",
    items: [
      { label: "Pink", href: "/category/pink" },
      { label: "Red", href: "/category/red" },
      { label: "Pastel", href: "/category/pastel" },
      { label: "Gold", href: "/category/gold" },
      { label: "Nude", href: "/category/nude" },
      { label: "Others", href: "/shop?tags=other-color" },
    ],
  },
  {
    title: "Shop By Texture",
    items: [
      { label: "Matte Nails", href: "/category/matte" },
      { label: "Glossy Nails", href: "/category/glossy" },
      { label: "Glitter Nails", href: "/category/glitter" },
    ],
  },
];

const featuredCards = [
  {
    title: "French Nails Set",
    subtitle: "Soft, polished, and minimal.",
    href: "/category/french",
    image: "/hero1.png",
  },
  {
    title: "Nude Glossy Set",
    subtitle: "Simple, clean, and elevated.",
    href: "/category/bridal",
    image: "/Wedding.png",
  },
];

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative flex items-center h-full uppercase"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-1 cursor-pointer group/item">
        <span className="hover:text-[#B39178] transition-colors duration-200 text-sm font-medium tracking-wide">
          SHOP
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 text-[#333333] group-hover/item:text-[#B39178] ${isOpen ? "rotate-180" : "rotate-0"}`}
          strokeWidth={2}
        />
      </div>

      {isOpen && (
        <div
          style={{ top: "150px" }}
          className="fixed left-0 z-[9999] w-full border-t border-[#ece2d9] bg-[#fcfaf7] shadow-[0_20px_60px_rgba(115,80,60,0.12)]"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute -top-12 left-0 h-12 w-full bg-transparent" />

          <div className="mx-auto max-w-[1280px] px-6 py-6">
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-8">
                <div className="grid grid-cols-4 gap-6">
                  {menuColumns.map((column) => (
                    <div key={column.title}>
                      <h3 className="text-[16px] font-semibold text-[#5b5b5b] mb-3">
                        {column.title}
                      </h3>
                      <ul className="space-y-2.5">
                        {column.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="text-[12px] text-[#666] hover:text-[#B39178] transition-colors"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-4 flex gap-6 border-l border-[#e8dfd7] pl-8">
                {featuredCards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group relative w-1/2 overflow-hidden rounded-[18px] bg-white"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-[#f4f0eb]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <h4 className="text-[12px] font-semibold leading-tight">{card.title}</h4>
                        <p className="mt-0.5 text-[10px] text-white/85">{card.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/shop"
              className="mt-5 inline-flex text-[12px] font-semibold uppercase tracking-[0.18em] text-[#B39178] hover:text-[#7a5641]"
            >
              Shop All
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
