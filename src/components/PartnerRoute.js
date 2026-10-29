"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Store, 
  Phone, 
  Mail, 
  RotateCcw, 
  LogOut, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  MapPin,
  ExternalLink
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function PartnerRoute({ children }) {
  const { user, role, partnerStatus, shopName, partnerData, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [liveStatus, setLiveStatus] = useState(partnerStatus);
  const [liveData, setLiveData] = useState(partnerData);

  useEffect(() => {
    setLiveStatus(partnerStatus);
    setLiveData(partnerData);
  }, [partnerStatus, partnerData]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login?role=partner");
      } else if (role !== "partner" && !isAdmin) {
        router.replace("/");
      }
    }
  }, [user, role, isAdmin, loading, router]);

  const handleManualRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setLiveStatus((d.partnerStatus || "pending").toLowerCase());
        setLiveData(d);
        if (d.partnerStatus === "approved") {
          window.location.reload();
        }
      }
    } catch (e) {
      console.warn("Error refreshing partner status:", e);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#140D0B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#E8C574] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#E8C574] font-medium tracking-widest uppercase">Verifying Partner Access...</p>
        </div>
      </div>
    );
  }

  // Not logged in or customer role
  if (!user || (role !== "partner" && !isAdmin)) {
    return null;
  }

  // Admin has universal override to preview partner panel
  if (isAdmin) {
    return <>{children}</>;
  }

  const currentStatus = liveStatus || partnerStatus || "pending";
  const data = liveData || partnerData || {};

  // If partner is pending approval
  if (currentStatus === "pending") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-amber-900/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3E0C15] via-[#571520] to-[#2A080C] text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span>Application Under Admin Review</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Welcome, {data?.shopName || shopName || "Partner"}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-md mx-auto leading-relaxed">
              Your seller account details have been received and are currently waiting for Maha Sell Admin Approval.
            </p>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 text-xs text-stone-700 leading-relaxed space-y-2">
              <p className="font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                What happens next?
              </p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li>Admin will review your shop details and verify your contact credentials.</li>
                <li>Once approved, your Partner Panel will unlock immediately, allowing you to upload products into all categories.</li>
                <li>When you upload products, they will undergo quick commission verification (default 15%) before going live.</li>
              </ul>
            </div>

            {/* Submitted Business Details Overview */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#571520]" />
                Registered Shop Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Shop / Business Name</span>
                  <span className="font-semibold text-stone-800">{data?.shopName || "Registered Store"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Contact Person</span>
                  <span className="font-semibold text-stone-800">{data?.name || user?.displayName || "Partner Owner"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Contact Phone</span>
                  <span className="font-semibold text-stone-800">{data?.phone || "—"}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-stone-800 truncate block">{user?.email}</span>
                </div>
                {data?.city && (
                  <div className="sm:col-span-2">
                    <span className="text-stone-400 block text-[11px]">Location</span>
                    <span className="font-semibold text-stone-800">
                      {[data?.shopAddress, data?.city, data?.state, data?.pincode].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#3E0C15] text-[#F3E5C8] font-semibold text-xs hover:bg-[#571520] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Checking Status..." : "Refresh Approval Status"}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="text-center pt-2 border-t border-stone-100">
              <Link href="/" className="text-xs text-stone-500 hover:text-[#3E0C15] inline-flex items-center gap-1.5 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Maha Sell Store</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If rejected by admin
  if (currentStatus === "rejected") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-red-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-900 to-rose-950 text-white p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 flex items-center justify-center text-rose-300">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-wide">
              Application Not Approved
            </h1>
            <p className="text-xs text-rose-200 mt-2">
              Your partner registration was not approved by the administrator.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {data?.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800">
                <span className="font-bold block mb-1">Admin Feedback:</span>
                <p>{data.rejectionReason}</p>
              </div>
            )}

            <p className="text-xs text-stone-600 leading-relaxed">
              If you believe this is a misunderstanding, please reach out to Maha Sell partner support directly at{" "}
              <a href="mailto:info@mahasell.in" className="font-bold text-[#571520] underline">info@mahasell.in</a>.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <Link href="/" className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Visit Store</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved partner -> full access
  return <>{children}</>;
}
