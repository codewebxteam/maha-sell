"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Filter,
  Eye,
  Store,
  Layers,
  ArrowRight
} from "lucide-react";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function PartnerProductsPage() {
  const { user, shopName, partnerData } = useAuth();
  const currentShopName = shopName || partnerData?.shopName || "My Store";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'approved', 'pending', 'rejected'
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", user.uid)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your catalog?`)) return;
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert("Failed to delete product: " + (e?.message || "Please try again"));
    }
  };

  const filteredProducts = products.filter(p => {
    const isLive = p.isVerified === true || p.verificationStatus === "approved";
    const isRejected = p.verificationStatus === "rejected";
    const isPending = !isLive && !isRejected;

    if (activeTab === "approved" && !isLive) return false;
    if (activeTab === "pending" && !isPending) return false;
    if (activeTab === "rejected" && !isRejected) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = (p.categoryName || p.category)?.toLowerCase().includes(q);
      return matchName || matchCat;
    }
    return true;
  });

  const countApproved = products.filter(p => p.isVerified === true || p.verificationStatus === "approved").length;
  const countPending = products.filter(p => p.isVerified === false && p.verificationStatus !== "rejected").length;
  const countRejected = products.filter(p => p.verificationStatus === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
            My Product Catalog
            <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              {products.length} Products
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Listed under store: <strong className="text-stone-800">{currentShopName}</strong>
          </p>
        </div>

        <Link
          href="/partner/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "all" ? "bg-[#3E0C15] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "approved" ? "bg-emerald-700 text-white" : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            Live &amp; Approved ({countApproved})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "pending" ? "bg-amber-700 text-white" : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            Under Review ({countPending})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rejected")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "rejected" ? "bg-rose-700 text-white" : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            Needs Revision ({countRejected})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search your products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
          />
        </div>
      </div>

      {/* Catalog List */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-400">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No products found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? "No products matching your search term." : "No products under this status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Stock</th>
                  <th className="py-3 px-4 font-bold">Your Price</th>
                  <th className="py-3 px-4 font-bold">Store Price &amp; Commission</th>
                  <th className="py-3 px-4 font-bold">Verification Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredProducts.map((p) => {
                  const isLive = p.isVerified === true || p.verificationStatus === "approved";
                  const isRejected = p.verificationStatus === "rejected";

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4 font-medium text-stone-900 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-stone-900 line-clamp-1 max-w-[220px]">{p.name}</p>
                          <span className="text-[10px] text-stone-400 font-mono block">ID: {p.id.slice(0, 8)}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-stone-600">
                        <span className="font-medium text-stone-800 block">{p.categoryName || p.category}</span>
                        {p.subcategoryName && (
                          <span className="text-[10px] text-stone-400 block">{p.subcategoryName}</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4 font-semibold text-stone-800">
                        {p.stock !== undefined ? p.stock : "—"}
                      </td>

                      {/* Partner Base Price */}
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        ₹{p.partnerBasePrice || p.price}
                      </td>

                      {/* Final Price & Commission */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#3E0C15] block">₹{p.price}</span>
                        <span className="text-[10px] text-stone-500 font-medium block">
                          {p.commissionPercent ? `${p.commissionPercent}% platform commission` : "15% standard commission"}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {isLive ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved &amp; Live
                            </span>
                            <span className="text-[10px] text-stone-400 block">Sold by: {currentShopName}</span>
                          </div>
                        ) : isRejected ? (
                          <div className="space-y-1 max-w-[180px]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <AlertCircle className="w-3 h-3" />
                              Revision Requested
                            </span>
                            {p.rejectionReason && (
                              <p className="text-[10px] text-rose-800 bg-rose-50/80 p-1.5 rounded-lg border border-rose-100 leading-tight">
                                {p.rejectionReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              <Clock className="w-3 h-3" />
                              Admin Verification Pending
                            </span>
                            <span className="text-[10px] text-stone-400 block">Pending 15% rate check</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLive && p.slug && (
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              title="View on Live Store"
                              className="p-1.5 rounded-lg text-stone-500 hover:text-[#3E0C15] hover:bg-stone-100 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
