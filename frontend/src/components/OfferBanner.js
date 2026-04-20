"use client";
import Link from "next/link";

export default function OfferBanner() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="relative w-full rounded-[2rem] overflow-hidden shadow-sm bg-gradient-to-r from-[#F8F1E7] via-[#E8DCCB] to-[#F8F1E7] px-5 sm:px-8 py-12 sm:py-16 md:py-24 text-center border border-[#B39178]/20 flex flex-col items-center justify-center">
          
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay"></div>
          
          <h2 className="relative z-10 text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#333333] font-light tracking-widest mb-4">
            BUY <span className="font-semibold text-[#76543F]">1</span> GET <span className="font-semibold text-[#76543F]">1</span> FREE
          </h2>
          
          <div className="relative z-10 inline-flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 mb-8 shadow-sm">
            <span className="text-[#B39178] uppercase tracking-widest text-xs md:text-sm font-semibold">Use Code:</span>
            <span className="text-[#333333] font-bold text-sm md:text-base tracking-[0.2em]">BOGO</span>
          </div>

          <Link href="/shop" className="relative z-10 bg-[#76543F] hover:bg-[#B39178] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Shop The Offer
          </Link>
        </div>
      </div>
    </section>
  );
}
