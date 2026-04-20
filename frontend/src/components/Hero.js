"use client";

import Image from "next/image";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { useState, useEffect } from "react";

const heroImages = [
  "/hero1.png",
  "/hero2.png" // User can add more images here in the future
];

export default function Hero() {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Crossfade every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-[#FCF9F5] min-h-[520px] md:min-h-[600px] lg:h-[90vh]">

      {/* 📸 BACKGROUND IMAGE SLIDER */}
      {heroImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Diya's Nail Art Premium Press-Ons ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover object-right-top md:object-center transition-opacity duration-1000 ease-in-out ${
            index === currentImg ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          quality={100}
        />
      ))}

      {/* 💬 TEXT CONTENT */}
      <div className="relative z-20 flex min-h-[520px] md:min-h-[600px] lg:h-full flex-col justify-center px-4 py-14 sm:px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl text-[#333333]">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#B39178]/30 mb-5 md:mb-6 w-fit animate-[fade-in_1s_ease-out]">
            <Sparkles className="w-4 h-4 text-[#B39178]" />
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-[#76543F] uppercase">
              Salon Quality At Home
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[2.6rem] leading-[1.05] sm:text-5xl md:text-7xl font-light tracking-tight mb-4 md:mb-6 animate-[fade-in_1s_ease-out]">
            Flawless Nails <br />
            <span className="font-medium italic text-[#B39178]">In Minutes.</span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-xl text-[#76543F] font-medium max-w-lg mb-8 md:mb-10 leading-relaxed animate-[fade-in_1s_ease-out]">
            Experience the elegance of handcrafted press-on nails. Perfectly shaped, durable, and completely indistinguishable from a salon manicure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center animate-[fade-in_1s_ease-out]">
            <button className="group relative overflow-hidden rounded-full bg-[#76543F] px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-3 transition-all hover:scale-105 hover:bg-[#B39178] shadow-[0_0_20px_rgba(118,84,63,0.3)] text-white w-full sm:w-auto">
              <span className="font-medium text-base sm:text-lg">Shop Collection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="rounded-full bg-white/40 backdrop-blur-sm border border-[#76543F]/40 px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-3 transition-all hover:bg-[#76543F] hover:text-white text-[#76543F] font-medium text-base sm:text-lg shadow-sm w-full sm:w-auto">
              View Lookbook
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 md:mt-12 flex flex-wrap items-center gap-3 md:gap-4 text-sm text-[#76543F] animate-[fade-in_1s_ease-out]">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-current text-[#B39178]" />
              ))}
            </div>
            <span className="w-[1px] h-4 bg-[#76543F]/30"></span>
            <p className="font-semibold text-[#333333]">10,000+ <span className="font-medium">Happy Customers</span></p>
            <span className="w-[1px] h-4 bg-[#76543F]/30 hidden sm:block"></span>
            <p className="hidden sm:block font-medium">Cruelty-Free & Vegan</p>
          </div>

        </div>
      </div>

    </section>
  );
}
