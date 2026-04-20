"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, ShoppingBag, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/account", label: "Account", icon: User },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/account?tab=wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-3 z-[1100] px-3 md:hidden">
      <div className="mx-auto flex max-w-[420px] items-center justify-between rounded-[28px] border border-white/80 bg-white/95 px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href.split("?")[0];

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[22px] px-2 py-2 text-[10px] font-medium transition-colors ${
                active ? "bg-[#F7F1E5] text-[#76543F]" : "text-[#6b5a4c]"
              }`}
            >
              <span className="relative">
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                {item.label === "Cart" && itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#76543F] px-1 text-[9px] font-bold text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
