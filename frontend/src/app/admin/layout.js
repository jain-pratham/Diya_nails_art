"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Hash, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Tags / Legacy", icon: Hash },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f6f3ef] text-gray-900">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-30 w-72 border-r border-[#e7ddd3] bg-white shadow-[8px_0_30px_rgba(115,80,60,0.04)]">
          <div className="flex h-full flex-col">
            <div className="border-b border-[#efe6dc] px-6 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a8836e]">Admin Panel</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#3f2a20]">Diya&apos;s Nail Art</h1>
              <p className="mt-2 text-sm leading-6 text-[#7e6554]">
                Manage products and tags from one clean dashboard.
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

        <main className="ml-72 flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
