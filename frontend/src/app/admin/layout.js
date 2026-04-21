"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Hash, ArrowLeft, Menu, X, ShoppingBag, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Hash },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ef] text-[#3f2a20]">
        <Loader2 className="animate-spin" size={34} />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ef] px-4 text-center text-[#3f2a20]">
        <div className="max-w-md rounded-2xl border border-[#e7ddd3] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-[#7e6554]">
            Login with an admin account to manage products, categories, and orders.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-[#3f2a20] px-5 py-3 text-sm font-medium text-white"
          >
            Back to store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3ef] text-gray-900">
      <div className="lg:hidden sticky top-0 z-40 border-b border-[#e7ddd3] bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e7ddd3] bg-white text-[#3f2a20]"
          >
            <Menu size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">Admin Panel</p>
            <p className="text-sm font-semibold text-[#3f2a20]">Diya&apos;s Nail Art</p>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#e7ddd3] bg-[#fcfaf7] px-3 text-xs font-medium text-[#3f2a20]"
          >
            Site
          </Link>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          <aside className="absolute left-0 top-0 h-full w-[84vw] max-w-[340px] border-r border-[#e7ddd3] bg-white shadow-[8px_0_30px_rgba(115,80,60,0.08)]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[#efe6dc] px-5 py-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">Admin Panel</p>
                  <p className="mt-1 text-lg font-semibold text-[#3f2a20]">Diya&apos;s Nail Art</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fcfaf7] text-[#3f2a20]"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 space-y-2 px-4 py-5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#f7efe5] text-[#7a5641]"
                          : "text-[#5b4032] hover:bg-[#faf6f1] hover:text-[#7a5641]"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-[#efe6dc] p-4">
                <Link
                  href="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#e7ddd3] bg-[#fcfaf7] px-4 py-3 text-sm font-medium text-[#3f2a20] hover:bg-[#f7efe5]"
                >
                  <ArrowLeft size={16} />
                  Back to site
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[#e7ddd3] bg-white shadow-[8px_0_30px_rgba(115,80,60,0.04)] lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-[#efe6dc] px-6 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">Admin Panel</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#3f2a20]">Diya&apos;s Nail Art</h1>
              <p className="mt-2 text-sm leading-6 text-[#7e6554]">
                Manage products, categories, orders, and revenue from one clean dashboard.
              </p>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#f7efe5] text-[#7a5641]"
                        : "text-[#5b4032] hover:bg-[#faf6f1] hover:text-[#7a5641]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-[#efe6dc] p-4">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#e7ddd3] bg-[#fcfaf7] px-4 py-3 text-sm font-medium text-[#3f2a20] hover:bg-[#f7efe5]"
              >
                <ArrowLeft size={16} />
                Back to site
              </Link>
            </div>
          </div>
        </aside>

        <main className="ml-0 flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:ml-72 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
