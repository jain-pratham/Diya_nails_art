"use client";
import { Sun, RefreshCcw, Clock, Hand } from "lucide-react";

const features = [
  { icon: Sun, title: "UV Gel Finish", desc: "Salon-grade gel shine that won't chip or fade." },
  { icon: RefreshCcw, title: "Reusable", desc: "Wear them over and over with our gentle adhesives." },
  { icon: Clock, title: "Long Lasting", desc: "Stays perfectly in place for up to 14 days." },
  { icon: Hand, title: "Handmade", desc: "Crafted with love by professional nail artists." },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-14 md:py-20 bg-[#FCF9F5]">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-[34px] text-[#333333] font-normal tracking-tight">Why Choose Diya's Nail Art?</h2>
          <p className="text-[#B39178] mt-2 md:mt-3 text-sm sm:text-base font-medium">Premium quality you can feel</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-md border border-[#E8DCCB]/20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F8F1E7] flex items-center justify-center mb-4 sm:mb-6 text-[#76543F]">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[#333333] text-base sm:text-lg font-medium mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-[#76543F]/80 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
