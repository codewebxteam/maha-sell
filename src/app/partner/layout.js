"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import PartnerSidebar from "./components/PartnerSidebar";
import PartnerHeader from "./components/PartnerHeader";
import PartnerRoute from "@/components/PartnerRoute";

export default function PartnerLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // If on registration page, render cleanly without PartnerRoute guard or dashboard sidebar
  if (pathname === "/partner/register") {
    return <>{children}</>;
  }

  return (
    <PartnerRoute>
      <div className="min-h-screen bg-[#F7F4EE] text-[#1F1815] flex">
        {/* Fixed Partner Sidebar */}
        <PartnerSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Main Partner Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Sticky Partner Header */}
          <PartnerHeader setIsMobileOpen={setIsMobileOpen} />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </PartnerRoute>
  );
}
