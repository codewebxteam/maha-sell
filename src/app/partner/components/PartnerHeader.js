"use client";

import { Menu, Plus, Bell, Store, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function PartnerHeader({ setIsMobileOpen }) {
  const { user, shopName, partnerData } = useAuth();
  const currentShopName = shopName || partnerData?.shopName || "Partner Store";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Drawer Button & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 rounded-xl text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#571520]">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 block leading-tight">{currentShopName}</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Active Partner
            </span>
          </div>
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/partner/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F3E5C8] text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>
    </header>
  );
}
