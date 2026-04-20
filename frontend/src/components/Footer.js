"use client";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] pt-14 md:pt-20 pb-10 text-gray-300">
      <div className="max-w-[1410px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand Col */}
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-light mb-4 sm:mb-6 tracking-wide">
              Diya's <span className="font-semibold text-[#B39178]">Nail Art</span>
            </h3>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-gray-400">
              Redefining the at-home manicure. Luxury, handmade press-on nails that look straight out of a premium salon.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <a href="#" className="hover:text-[#B39178] transition-colors text-xs uppercase tracking-widest font-semibold border-b border-transparent hover:border-[#B39178] pb-1">Instagram</a>
              <a href="#" className="hover:text-[#B39178] transition-colors text-xs uppercase tracking-widest font-semibold border-b border-transparent hover:border-[#B39178] pb-1">Facebook</a>
              <a href="#" className="hover:text-[#B39178] transition-colors text-xs uppercase tracking-widest font-semibold border-b border-transparent hover:border-[#B39178] pb-1">Twitter</a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5 sm:mb-6">Shop</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li><Link href="/shop/all" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop/new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-white transition-colors">Accessories & Glue</Link></li>
              <li><Link href="/gift-cards" className="hover:text-white transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5 sm:mb-6">Support</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/sizing-guide" className="hover:text-white transition-colors">Sizing Guide</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-5 sm:mb-6">Contact</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#B39178] shrink-0 mt-0.5" />
                <span>123 Beauty Lane, Suite 100<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#B39178] shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#B39178] shrink-0" />
                <span>hello@diyasnailart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Diya's Nail Art. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
