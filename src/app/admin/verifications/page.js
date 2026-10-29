"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Percent, 
  Store, 
  ExternalLink, 
  RotateCcw, 
  Layers, 
  Eye, 
  X, 
  Check, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  Package
} from "lucide-react";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminProductVerificationsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Commission rates state per product id (default 15% automatic!)
  const [commissionRates, setCommissionRates] = useState({});
  const [customPrices, setCustomPrices] = useState({});

  // Rejection modal state
  const [rejectionModal, setRejectionModal] = useState({ open: false, productId: null, reason: "" });

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      // Query all products submitted by sellers (where sellerId exists or status == 'pending_verification' or isVerified == false)
      const q = query(collection(db, "products"));
      const snap = await getDocs(q);
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(d => d.sellerId || d.sellerShopName || d.status === "pending_verification" || d.isVerified === false);

      list.sort((a, b) => {
        const tA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt || 0).getTime();
        const tB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt || 0).getTime();
        return tB - tA;
      });

      setProducts(list);

      // Initialize commission rates with existing commissionPercent or default 15%
      const rates = {};
      const prices = {};
      list.forEach(p => {
        const defaultRate = p.commissionPercent !== undefined ? p.commissionPercent : 15;
        rates[p.id] = defaultRate;

        const base = Number(p.partnerBasePrice || p.price || 0);
        const commAmt = Math.round(base * (defaultRate / 100));
        prices[p.id] = p.isVerified ? (p.price || base + commAmt) : (base + commAmt);
      });
      setCommissionRates(rates);
      setCustomPrices(prices);
    } catch (err) {
      console.warn("Notice: Fetching verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  // Handle commission % change
  const handleCommissionChange = (productId, basePrice, newRate) => {
    const rateNum = Number(newRate) || 0;
    setCommissionRates(prev => ({ ...prev, [productId]: rateNum }));

    const base = Number(basePrice) || 0;
    const commAmt = Math.round(base * (rateNum / 100));
    setCustomPrices(prev => ({ ...prev, [productId]: base + commAmt }));
  };

  // Handle final selling price manual change
  const handlePriceChange = (productId, basePrice, newSellingPrice) => {
    const priceNum = Number(newSellingPrice) || 0;
    setCustomPrices(prev => ({ ...prev, [productId]: priceNum }));

    const base = Number(basePrice) || 0;
    if (base > 0 && priceNum >= base) {
      const calculatedRate = Math.round(((priceNum - base) / base) * 100);
      setCommissionRates(prev => ({ ...prev, [productId]: calculatedRate }));
    }
  };

  // Approve product & publish live
  const handleApproveProduct = async (product) => {
    const rate = commissionRates[product.id] !== undefined ? commissionRates[product.id] : 15;
    const finalPrice = customPrices[product.id] || Number(product.price);
    const basePrice = Number(product.partnerBasePrice || product.price);

    setActionLoadingId(product.id);
    try {
      await updateDoc(doc(db, "products", product.id), {
        isVerified: true,
        status: "active",
        verificationStatus: "approved",
        commissionPercent: Number(rate),
        partnerBasePrice: basePrice,
        price: Number(finalPrice),
        verifiedAt: serverTimestamp(),
        rejectionReason: null
      });

      setProducts(prev => prev.map(p => p.id === product.id ? {
        ...p,
        isVerified: true,
        status: "active",
        verificationStatus: "approved",
        commissionPercent: Number(rate),
        price: Number(finalPrice)
      } : p));

      alert(`Product "${product.name}" has been approved and published live to the website with ${rate}% commission and seller name "${product.sellerShopName || 'Partner'}"!`);
    } catch (err) {
      alert("Failed to approve product: " + (err?.message || "Please check Firestore rules"));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject product
  const handleRejectProduct = async () => {
    const { productId, reason } = rejectionModal;
    if (!productId) return;

    setActionLoadingId(productId);
    try {
      const rejReason = reason.trim() || "Price revision needed or product details incomplete.";
      await updateDoc(doc(db, "products", productId), {
        isVerified: false,
        status: "rejected",
        verificationStatus: "rejected",
        rejectionReason: rejReason
      });

      setProducts(prev => prev.map(p => p.id === productId ? {
        ...p,
        isVerified: false,
        status: "rejected",
        verificationStatus: "rejected",
        rejectionReason: rejReason
      } : p));

      setRejectionModal({ open: false, productId: null, reason: "" });
      alert("Product marked as rejected and feedback sent to partner.");
    } catch (err) {
      alert("Failed to reject product: " + (err?.message || "Please check Firestore rules"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingList = products.filter(p => p.isVerified === false && p.verificationStatus !== "rejected");
  const approvedList = products.filter(p => p.isVerified === true || p.verificationStatus === "approved");
  const rejectedList = products.filter(p => p.verificationStatus === "rejected");

  const displayedList = products.filter(p => {
    const isLive = p.isVerified === true || p.verificationStatus === "approved";
    const isRejected = p.verificationStatus === "rejected";
    const isPending = !isLive && !isRejected;

    if (activeTab === "pending" && !isPending) return false;
    if (activeTab === "approved" && !isLive) return false;
    if (activeTab === "rejected" && !isRejected) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchShop = p.sellerShopName?.toLowerCase().includes(q);
      const matchCat = (p.categoryName || p.category)?.toLowerCase().includes(q);
      return matchName || matchShop || matchCat;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
            Partner Product Verifications
            {pendingList.length > 0 && (
              <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-500/30">
                {pendingList.length} Pending
              </span>
            )}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review partner catalog submissions, finalize commission rate (<strong>default 15% automatic</strong>, editable), and publish live to store.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchVerifications}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pending" ? "bg-amber-700 text-white" : "text-amber-800 hover:bg-amber-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "approved" ? "bg-emerald-700 text-white" : "text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Published to Website ({approvedList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rejected")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "rejected" ? "bg-rose-700 text-white" : "text-rose-800 hover:bg-rose-50"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Revision Required ({rejectedList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "all" ? "bg-[#3E0C15] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            All Submissions ({products.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by product, shop, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
          />
        </div>
      </div>

      {/* Main Verification Cards / Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-xs text-stone-400 border border-stone-200/80">
          Loading product verification queue...
        </div>
      ) : displayedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80">
          <ShieldCheck className="w-12 h-12 text-stone-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-stone-800">No products in this verification list</h3>
          <p className="text-xs text-stone-500 mt-1">
            {searchQuery ? "No products matching your search term." : "All partner submissions under this status have been handled."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((product) => {
            const isLive = product.isVerified === true || product.verificationStatus === "approved";
            const isRejected = product.verificationStatus === "rejected";
            const isPending = !isLive && !isRejected;

            const basePrice = Number(product.partnerBasePrice || product.price || 0);
            const currentRate = commissionRates[product.id] !== undefined ? commissionRates[product.id] : 15;
            const currentPrice = customPrices[product.id] !== undefined ? customPrices[product.id] : (basePrice + Math.round(basePrice * 0.15));
            const commAmount = Math.round(basePrice * (currentRate / 100));

            return (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden transition-all hover:border-amber-500/40 p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Left: Product Thumbnail & Shop Brand */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative group">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      {product.images?.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          +{product.images.length - 1} photos
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      {/* Shop Name Tag */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#571520] border border-amber-200 text-[11px] font-bold">
                          <Store className="w-3 h-3 text-[#C5832B]" />
                          <span>Sold by: <strong>{product.sellerShopName || "Partner"}</strong></span>
                        </span>

                        <span className="text-[11px] font-medium text-stone-500">
                          Category: <strong className="text-stone-800">{product.categoryName || product.category}</strong>
                        </span>

                        {isLive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Live on Storefront
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </div>

                      {/* Product Title */}
                      <h3 className="font-serif text-base font-bold text-stone-900 leading-snug line-clamp-1 sm:line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span>Fabric: <strong className="text-stone-700">{product.fabricName || "Standard"}</strong></span>
                        <span>•</span>
                        <span>Stock: <strong className="text-stone-700">{product.stock || 10} units</strong></span>
                        {product.sellerPhone && (
                          <>
                            <span>•</span>
                            <span>Phone: <strong className="text-stone-700">{product.sellerPhone}</strong></span>
                          </>
                        )}
                      </div>

                      {/* Rejection Note if rejected */}
                      {product.rejectionReason && (
                        <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                          <strong>Admin Feedback:</strong> {product.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Interactive Commission & Pricing Calculator */}
                  <div className="w-full lg:w-96 bg-stone-50/80 rounded-2xl p-4 border border-stone-200 space-y-3 shrink-0">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200">
                      <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                        Pricing &amp; Commission Verification
                      </span>
                      <span className="text-[10px] font-bold bg-[#571520] text-[#F3E5C8] px-2 py-0.5 rounded-full">
                        Default 15%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Partner Asking Price</span>
                        <span className="font-bold text-stone-900 text-sm">₹{basePrice.toLocaleString("en-IN")}</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px]">MRP (Printed)</span>
                        <span className="font-semibold text-stone-500 text-sm">₹{product.originalPrice || Math.round(basePrice * 1.5)}</span>
                      </div>
                    </div>

                    {/* Commission Inputs */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Commission % (Editable)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={currentRate}
                            onChange={(e) => handleCommissionChange(product.id, basePrice, e.target.value)}
                            className="w-full pl-3 pr-7 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-[#571520] focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">%</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Live Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          min={basePrice}
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(product.id, basePrice, e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                        />
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-600">
                      <span>Platform Earning (+{currentRate}%):</span>
                      <span className="font-bold text-emerald-700">+₹{commAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Right: Approval Actions */}
                  <div className="flex flex-row lg:flex-col items-center justify-end gap-2.5 w-full lg:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveProduct(product)}
                      disabled={actionLoadingId === product.id}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isLive ? "Update & Republish" : "Approve & Publish"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRejectionModal({ open: true, productId: product.id, reason: "" })}
                      disabled={actionLoadingId === product.id}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Reject / Feedback</span>
                    </button>

                    {isLive && product.slug && (
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#571520] hover:underline"
                      >
                        <span>View Live Store</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Note Modal */}
      {rejectionModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-red-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Reject Product or Request Changes</h3>
            <p className="text-xs text-stone-600">
              Provide feedback for the partner explaining what needs to be changed (e.g. Asking price too high, images unclear):
            </p>
            <textarea
              rows={3}
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g. Please reduce asking price to wholesale market rate or upload high-res cover image..."
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModal({ open: false, productId: null, reason: "" })}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectProduct}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
