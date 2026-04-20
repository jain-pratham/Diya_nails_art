"use client";

import Image from "next/image";
import Link from "next/link";

const occasions = [
  { name: "Wedding", image: "/wedding.png", tag: "bridal" },
  { name: "Party", image: "/party.png", tag: "party" },
  { name: "Casual", image: "/casual.png", tag: "casual" },
  { name: "Holiday", image: "/holiday.png", tag: "glossy" },
  { name: "Formal", image: "/Formal.png", tag: "matte" },
];

export default function ShopByOccasion() {
  return (
    <section className="w-full py-14 md:py-20 bg-[#FCF9F5]">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight">Shop By Occasion</h2>
          <p className="text-[#B39178] mt-2 md:mt-3 text-sm sm:text-base font-medium">Find the perfect set for your next event</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {occasions.map((occ, idx) => (
            <Link href={`/category/${occ.tag}`} key={idx} className="group block cursor-pointer">
              <div className="relative w-full aspect-square rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white border border-[#E8DCCB]/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity" />
                <Image 
                  src={occ.image} 
                  fill 
                  alt={occ.name} 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  unoptimized
                  onError={(e) => { e.target.style.display='none'; }}
                />
                <div className="absolute inset-0 bg-[#E8DCCB] -z-10"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center z-20 px-2">
                  <h3 className="text-white text-sm sm:text-lg font-medium tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {occ.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
