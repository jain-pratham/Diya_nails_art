"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const [openSection, setOpenSection] = useState("shop");

  const footerSections = [
    {
      key: "shop",
      title: "Shop",
      links: [
        { href: "/shop/all", label: "All Products" },
        { href: "/shop/new", label: "New Arrivals" },
        { href: "/shop/best-sellers", label: "Best Sellers" },
        { href: "/shop/accessories", label: "Accessories & Glue" },
        { href: "/gift-cards", label: "Gift Cards" },
      ],
    },
    {
      key: "support",
      title: "Support",
      links: [
        { href: "/faq", label: "FAQ" },
        { href: "/shipping", label: "Shipping & Returns" },
        { href: "/track-order", label: "Track Your Order" },
        { href: "/sizing-guide", label: "Sizing Guide" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#1A1A1A] pt-6 md:pt-20 pb-20 md:pb-10 text-gray-300">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12 mb-6 md:mb-16">
          {/* Brand Col */}
          <div className="border-b border-white/10 pb-4 md:border-b-0 md:pb-0">
            <h3 className="text-white text-base sm:text-2xl font-light mb-2 sm:mb-6 tracking-wide">
              Diya&apos;s <span className="font-semibold text-[#B39178]">Nail Art</span>
            </h3>
            <p className="max-w-xs text-[11px] sm:text-sm leading-relaxed mb-3 sm:mb-6 text-gray-400">
              Redefining the at-home manicure. Luxury, handmade press-on nails that look straight out of a premium salon.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-2 sm:gap-6">
              <a href="#" className="hover:text-[#B39178] transition-colors text-xs uppercase tracking-widest font-semibold border-b border-transparent hover:border-[#B39178] pb-1">Instagram</a>
              <a href="#" className="hover:text-[#B39178] transition-colors text-xs uppercase tracking-widest font-semibold border-b border-transparent hover:border-[#B39178] pb-1">Facebook</a>
              <a href="#" className="hover:text-[#B39178] transition-colors text-xs uppercase tracking-widest font-semibold border-b border-transparent hover:border-[#B39178] pb-1">Twitter</a>
            </div>
          </div>

          {footerSections.map((section) => {
            const isOpen = openSection === section.key;

            return (
              <div
                key={section.key}
                className="border-b border-white/10 md:border-b-0 pb-1 md:pb-0"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2.5 md:hidden"
                  onClick={() =>
                    setOpenSection((current) =>
                      current === section.key ? "" : section.key
                    )
                  }
                >
                  <span className="text-[13px] text-white font-semibold tracking-[0.18em] uppercase">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#B39178] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div className="hidden md:block">
                  <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5 sm:mb-6">
                    {section.title}
                  </h4>
                </div>

                <ul className={`${isOpen ? "flex" : "hidden"} md:flex flex-col space-y-2.5 sm:space-y-4 pb-3 md:pb-0 text-sm`}>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[13px] md:text-sm hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Contact Info */}
          <div className="pt-1 md:pt-0">
            <h4 className="text-white text-[13px] md:text-sm font-semibold tracking-[0.18em] md:tracking-wider uppercase mb-3 sm:mb-6">Contact</h4>
            <ul className="space-y-2.5 sm:space-y-4 text-[13px] md:text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#B39178] shrink-0 mt-0.5" />
                <span>123 Beauty Lane, Suite 100<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#B39178] shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#B39178] shrink-0" />
                <span>hello@diyasnailart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-500">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Diya&apos;s Nail Art. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
