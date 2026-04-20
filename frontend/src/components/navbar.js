"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag, ChevronLeft, ChevronRight, X, LogOut, Settings, Package, Menu } from "lucide-react";
import MegaMenu from "@/components/MegaMenu";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [openSearch, setOpenSearch] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShopSubmenu, setShowShopSubmenu] = useState(false);
  const { user, logout } = useAuth();

  const handleUserClick = () => {
    if (user) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="w-full sticky top-0 z-[1000] bg-white">
      {/* 🔴 TOP SALE BAR */}
      <div className="bg-[#76543F] text-white text-[10px] sm:text-[11px] text-center py-2 font-bold tracking-[0.15em] flex justify-center items-center gap-4 sm:gap-24 md:gap-64 px-3">
        <ChevronLeft size={14} className="text-white/70 cursor-pointer hover:text-white shrink-0" strokeWidth={1.5} />
        <span className="mt-0.5 whitespace-nowrap">THE SPRING EDIT</span>
        <ChevronRight size={14} className="text-white/70 cursor-pointer hover:text-white shrink-0" strokeWidth={1.5} />
      </div>

      {/* 🔹 MAIN NAVBAR */}
      <nav className="relative bg-white pt-4 pb-3 md:pt-6 md:pb-5 px-4 sm:px-6 border-b border-[#B39178]/20">
        <div className="w-full relative flex items-center justify-between min-h-[44px] md:min-h-[32px]">
          <button
            type="button"
            onClick={() => setShowMobileMenu((value) => !value)}
            className="md:hidden flex items-center justify-start text-[#333333]"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.6} />
          </button>

          {/* LOGO */}
          <div className="absolute left-1/2 top-1/2 z-20 flex h-[44px] w-[190px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible sm:w-[230px] md:h-auto md:w-auto">
            <Link href="/" className="relative flex h-full w-full items-center justify-center md:h-auto md:w-auto">
              <img
                src="/logo.png"
                alt="Logo"
                className="pointer-events-none absolute left-1/2 top-[calc(50%+10px)] h-auto w-[300px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-multiply drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] sm:w-[350px] md:relative md:left-auto md:top-auto md:h-60 md:w-auto md:translate-x-0 md:translate-y-0"
              />
            </Link>
          </div>
          {/* RIGHT SIDE ICONS */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-4 sm:gap-5">
            <div className="relative">
              <Icon onClick={handleUserClick}>
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-[#F7F1E5] border border-[#B39178]/30 flex items-center justify-center text-[#76543F] text-xs font-bold uppercase transition-all hover:border-[#76543F]">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <User size={22} strokeWidth={1} />
                )}
              </Icon>

              {/* User Dropdown */}
              {user && showUserDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-[#B39178]/20 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-[#B39178]/10 bg-[#F7F1E5]/30">
                    <p className="text-[13px] font-bold text-[#4A3324]">{user.name}</p>
                    <p className="text-[11px] text-[#8C7361] truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <DropdownItem href="/account">
                      <Package size={16} strokeWidth={1.5} />
                      <span>My Orders</span>
                    </DropdownItem>
                    <DropdownItem href="/account/settings">
                      <Settings size={16} strokeWidth={1.5} />
                      <span>Settings</span>
                    </DropdownItem>
                    <div className="my-1 border-t border-[#B39178]/10" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                      <LogOut size={16} strokeWidth={1.5} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Icon onClick={() => setOpenSearch(!openSearch)}>
              <Search size={22} strokeWidth={1} />
            </Icon>
            <Link href="/cart">
              <Icon className="relative">
                <ShoppingBag size={22} strokeWidth={1} />
              </Icon>
            </Link>
          </div>
        </div>

        {/* Bottom Row: Links */}
        <div className="hidden md:flex justify-center items-center gap-10 mt-6 text-[13px] font-bold tracking-[0.12em] text-[#333333]">
          <NavItem href="/">HOME</NavItem>
          <div className="relative">
            <MegaMenu />
          </div>
          <NavItem href="/sale">SALE</NavItem>
          <NavItem href="/designer-nails">DESIGNER NAILS</NavItem>
          <NavItem href="/tutorial">TUTORIAL</NavItem>
          <NavItem href="/contact-us">CONTACT US</NavItem>
        </div>
      </nav>

      {/* 🔍 SEARCH BAR */}
      {openSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-[#B39178]/20 px-6 py-4 flex items-center justify-between shadow-md origin-top animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center w-full max-w-7xl mx-auto gap-4">
            <Search size={22} className="text-[#333333]" strokeWidth={1} />
            <input
              type="text"
              placeholder="SEARCH FOR..."
              autoFocus
              className="w-full outline-none text-[13px] tracking-[0.15em] placeholder:text-[#333333]/50 bg-transparent text-[#333333]"
            />
          </div>
          <button
            onClick={() => setOpenSearch(false)}
            className="text-[#333333] hover:text-[#B39178] transition-colors ml-4"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-[1200]">
          <div
            className="absolute inset-0 bg-black/25"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="relative h-full w-[86vw] max-w-[340px] overflow-y-auto rounded-r-[28px] border-r border-[#E8DCCB] bg-white/98 px-5 py-5 pb-32 shadow-[0_20px_40px_rgba(0,0,0,0.12)] backdrop-blur-md animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]/70">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B39178]">Menu</p>
                <p className="text-sm font-medium text-[#333333]">Browse collections</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileMenu(false)}
                className="rounded-full p-2 text-[#333333]"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="pt-4">
              <MobileSideItem href="/" label="Home" onClick={() => setShowMobileMenu(false)} />
              <div className="border-b border-[#E8DCCB]/70">
                <div className="flex items-center justify-between py-4">
                  <Link
                    href="/shop"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-[15px] font-bold tracking-[0.12em] text-[#111111] uppercase"
                  >
                    Shop
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowShopSubmenu((value) => !value)}
                    className="rounded-full p-1 text-[#8b6a56]"
                    aria-label="Toggle shop categories"
                  >
                    <ChevronRight
                      size={18}
                      className={`transition-transform duration-200 ${showShopSubmenu ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>

                {showShopSubmenu && (
                  <div className="pb-3 pl-2">
                    <MobileSubLink href="/shop" label="All Products" onClick={() => setShowMobileMenu(false)} />
                    <MobileSubLink href="/category/french" label="French Nails" onClick={() => setShowMobileMenu(false)} />
                    <MobileSubLink href="/category/bridal" label="Bridal Nails" onClick={() => setShowMobileMenu(false)} />
                    <MobileSubLink href="/category/pink" label="Pink Nails" onClick={() => setShowMobileMenu(false)} />
                    <MobileSubLink href="/category/glossy" label="Glossy Nails" onClick={() => setShowMobileMenu(false)} />
                  </div>
                )}
              </div>
              <MobileSideItem href="/sale" label="Sale" onClick={() => setShowMobileMenu(false)} />
              <MobileSideItem href="/designer-nails" label="Designer Nails" onClick={() => setShowMobileMenu(false)} />
              <MobileSideItem href="/tutorial" label="Tutorial" onClick={() => setShowMobileMenu(false)} />
              <MobileSideItem href="/blog" label="Blog" onClick={() => setShowMobileMenu(false)} />
              <MobileSideItem href="/contact-us" label="Contact Us" onClick={() => setShowMobileMenu(false)} />
            </div>

            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setShowMobileMenu(false);
                }}
                className="flex w-full items-center justify-center rounded-full bg-[#111111] px-4 py-3.5 text-sm font-semibold text-white"
              >
                LOG IN
              </button>
              <Link
                href="/account"
                onClick={() => setShowMobileMenu(false)}
                className="flex w-full items-center justify-center rounded-full border border-[#E8DCCB] bg-white px-4 py-3.5 text-sm font-semibold text-[#111111]"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 🔑 AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}

/* 🔹 Support Components */

const NavItem = ({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`hover:text-[#B39178] transition-colors ${className}`}
  >
    {children}
  </Link>
);

const Icon = ({ children, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`text-[#333333] hover:text-[#B39178] transition-all duration-300 ${className}`}
  >
    {children}
  </button>
);

const DropdownItem = ({ href, children }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-[#4A3324] hover:bg-[#F7F1E5]/50 rounded-xl transition-all font-medium"
  >
    {children}
  </Link>
);

const MobileSideItem = ({ href, label, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center justify-between border-b border-[#E8DCCB]/70 py-4 text-[15px] font-bold uppercase tracking-[0.12em] text-[#111111]"
  >
    <span>{label}</span>
  </Link>
);

const MobileSubLink = ({ href, label, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block py-2 text-[13px] font-medium uppercase tracking-[0.1em] text-[#6b5a4c]"
  >
    {label}
  </Link>
);
