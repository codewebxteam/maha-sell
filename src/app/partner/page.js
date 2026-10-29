"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Store, 
  Sparkles, 
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Percent,
  Eye
} from "lucide-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function PartnerDashboard() {
  const { user, shopName, partnerData } = useAuth();
  const currentShopName = shopName || partnerData?.shopName || "My Store";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartnerProducts() {
      if (!user) return;
      try {
        // Query products where sellerId == user.uid
        const q = query(
          collection(db, "products"),
          where("sellerId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort descending by createdAt
        list.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt || 0).getTime();
          const tB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });
        setProducts(list);
      } catch (err) {
        console.warn("Notice: Fetching partner products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartnerProducts();
  }, [user]);

  const totalProducts = products.length;
  const approvedProducts = products.filter(p => p.isVerified === true || p.verificationStatus === "approved");
  const pendingProducts = products.filter(p => p.isVerified === false && p.verificationStatus !== "rejected");
  const rejectedProducts = products.filter(p => p.verificationStatus === "rejected");

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#3E0C15] via-[#571520] to-[#2A080C] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-[#3E251A]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8C574]/20 border border-[#E8C574]/40 text-[#E8C574] text-xs font-semibold uppercase tracking-wider mb-3">
            <Store className="w-3.5 h-3.5" />
            <span>Partner Hub</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
            Namaste, {currentShopName}
          </h1>
          <p className="text-xs sm:text-sm text-[#E5D7BF] mt-2 leading-relaxed">
            Welcome to your dedicated Maha Sell merchant panel. Add new products across categories, track admin verification, and monitor live store listings.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              href="/partner/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5832B] hover:bg-[#D4933B] text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/partner/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-semibold text-xs transition-all border border-white/15"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Verification & Commission Explainer Strip */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#571520] text-[#E8C574] flex items-center justify-center shrink-0 mt-0.5">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#3E0C15]">How Product Verification Works</h2>
            <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
              When you add a product, it enters <strong>Admin Verification</strong>. Admin reviews details and sets the 15% commission (or approved rate). Once verified, it is published on Maha Sell with your shop name: <strong>&quot;Sold by: {currentShopName}&quot;</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{totalProducts}</div>
          <p className="text-[11px] text-stone-400 mt-1">Submitted in your catalog</p>
        </div>

        {/* Approved & Live */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved &amp; Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">{approvedProducts.length}</div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Live for customers to buy</p>
        </div>

        {/* Pending Verification */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Verification</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700">{pendingProducts.length}</div>
          <p className="text-[11px] text-amber-600/80 mt-1">Awaiting admin commission review</p>
        </div>

        {/* Platform Commission */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-[#571520] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Rate</span>
            <Percent className="w-4 h-4 text-[#C5832B]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#571520]">15%</div>
          <p className="text-[11px] text-stone-400 mt-1">Standard verification commission</p>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900">Recent Product Submissions</h2>
            <p className="text-xs text-stone-500">Track status and verification progress of your items</p>
          </div>
          <Link
            href="/partner/products"
            className="text-xs font-bold text-[#571520] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5832B] flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-800">No products uploaded yet</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Start adding your products now. Choose from existing categories and submit for verification.
            </p>
            <Link
              href="/partner/products/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E0C15] text-[#F3E5C8] text-xs font-bold shadow-xs hover:bg-[#571520]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Partner Price</th>
                  <th className="py-3 px-4 font-bold">Selling Price</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {products.slice(0, 5).map((p) => {
                  const isLive = p.isVerified === true || p.verificationStatus === "approved";
                  const isRejected = p.verificationStatus === "rejected";
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-stone-900 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="line-clamp-1 max-w-[200px]">{p.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{p.categoryName || p.category}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">₹{p.partnerBasePrice || p.price}</td>
                      <td className="py-3.5 px-4 font-bold text-[#3E0C15]">
                        ₹{p.price}
                        {p.commissionPercent && (
                          <span className="text-[10px] font-normal text-stone-400 ml-1">({p.commissionPercent}% com.)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Live on Store
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            Needs Revision
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            Admin Verification Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isLive && p.slug ? (
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#571520] hover:underline"
                          >
                            <span>Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-stone-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
