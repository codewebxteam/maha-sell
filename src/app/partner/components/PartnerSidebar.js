"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Store, 
  Settings, 
  ExternalLink,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building2,
  Clock
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";

export default function PartnerSidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, shopName, partnerData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Partner logout error:", err);
    }
  };

  const navItems = [
    { name: "Partner Dashboard", href: "/partner", icon: LayoutDashboard, exact: true },
    { name: "My Product Catalog", href: "/partner/products", icon: Package },
    { name: "Add New Product", href: "/partner/products/new", icon: PlusCircle, highlight: true },
    { name: "Shop Profile & Bank", href: "/partner/profile", icon: Store },
  ];

  const currentShopName = shopName || partnerData?.shopName || "My Store";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1A1210] text-[#F3E5C8] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#382018]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#382018] flex items-center justify-between">
          <Link href="/partner" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9B111E] to-[#C5832B] flex items-center justify-center text-white shadow-lg font-serif font-bold text-xl ring-2 ring-[#E8C574]/30">
              MS
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-[#FAF7F2] flex items-center gap-1.5">
                Maha Sell
                <span className="text-[9px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider">
                  Partner
                </span>
              </h1>
              <p className="text-xs text-stone-400 font-sans truncate max-w-[150px]">{currentShopName}</p>
            </div>
          </Link>
        </div>

        {/* Shop Overview Pill */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-3 rounded-2xl bg-[#261814] border border-[#3E251A] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3E0C15] flex items-center justify-center text-[#E8C574]">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Store Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Seller
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-2">
            Store Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href) && (item.href !== "/partner" || pathname === "/partner");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${isActive 
                    ? "bg-gradient-to-r from-[#571520] to-[#3A0D15] text-[#FAF7F2] font-semibold shadow-md border border-[#9B111E]/40" 
                    : item.highlight
                    ? "text-[#E8C574] hover:bg-[#2A1C18] hover:text-[#FFF8E7]"
                    : "text-stone-300 hover:bg-[#2A1C18] hover:text-[#FAF7F2]"}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-[#E8C574]" : item.highlight ? "text-[#E8C574]" : "text-stone-400 group-hover:text-stone-200"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#E8C574]" />}
              </Link>
            );
          })}

          <div className="pt-6">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-2">
              Customer Store
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-300 hover:bg-[#2A1C18] hover:text-white transition-all border border-dashed border-[#3E251A]"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-[#C5832B]" />
                <span>View Live Website</span>
              </div>
            </Link>
          </div>
        </nav>

        {/* Partner Footer */}
        <div className="p-4 border-t border-[#382018] bg-[#140D0B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#3E0C15] border border-[#C5832B]/50 flex items-center justify-center text-sm font-bold text-[#E8C574] shrink-0">
                {(currentShopName[0] || "P").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#FAF7F2] truncate">{user?.displayName || currentShopName}</p>
                <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleLogout} 
              title="Sign Out"
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
