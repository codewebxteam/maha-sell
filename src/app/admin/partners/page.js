"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Building2, 
  Eye, 
  X, 
  RotateCcw,
  UserCheck,
  UserX,
  Sparkles,
  ExternalLink,
  Layers
} from "lucide-react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionModal, setRejectionModal] = useState({ open: false, partnerId: null, reason: "" });
  const [productCounts, setProductCounts] = useState({});

  const fetchPartners = async () => {
    setLoading(true);
    try {
      // Fetch all users with role === 'partner'
      const q = query(collection(db, "users"), where("role", "==", "partner"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setPartners(list);

      // Also get product count for each partner
      const prodSnap = await getDocs(collection(db, "products"));
      const counts = {};
      prodSnap.docs.forEach(d => {
        const data = d.data();
        if (data.sellerId) {
          counts[data.sellerId] = (counts[data.sellerId] || 0) + 1;
        }
      });
      setProductCounts(counts);
    } catch (err) {
      console.warn("Notice: Fetching partners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleApprove = async (partnerId, shopName) => {
    if (!confirm(`Are you sure you want to approve "${shopName || 'this partner'}"? Once approved, the partner can log into their Partner Panel and upload products.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await updateDoc(doc(db, "users", partnerId), {
        partnerStatus: "approved",
        isPartnerVerified: true,
        approvedAt: new Date().toISOString(),
        rejectionReason: null
      });
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, partnerStatus: "approved", isPartnerVerified: true } : p));
      if (selectedPartner?.id === partnerId) {
        setSelectedPartner(prev => ({ ...prev, partnerStatus: "approved", isPartnerVerified: true }));
      }
      alert(`Partner "${shopName}" has been successfully approved!`);
    } catch (e) {
      alert("Failed to approve partner: " + (e?.message || "Please check Firestore rules"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const { partnerId, reason } = rejectionModal;
    if (!partnerId) return;
    setActionLoading(true);
    try {
      await updateDoc(doc(db, "users", partnerId), {
        partnerStatus: "rejected",
        isPartnerVerified: false,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason.trim() || "Documents or store details incomplete."
      });
      setPartners(prev => prev.map(p => p.id === partnerId ? { 
        ...p, 
        partnerStatus: "rejected", 
        isPartnerVerified: false, 
        rejectionReason: reason.trim() || "Documents or store details incomplete." 
      } : p));
      setRejectionModal({ open: false, partnerId: null, reason: "" });
      if (selectedPartner?.id === partnerId) {
        setSelectedPartner(prev => ({ ...prev, partnerStatus: "rejected" }));
      }
      alert("Partner application marked as rejected.");
    } catch (e) {
      alert("Failed to reject partner: " + (e?.message || "Please check Firestore rules"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (partnerId, currentStatus) => {
    const newStatus = currentStatus === "approved" ? "suspended" : "approved";
    const msg = newStatus === "suspended" ? "suspend this partner's access" : "reactivate this partner";
    if (!confirm(`Are you sure you want to ${msg}?`)) return;

    setActionLoading(true);
    try {
      await updateDoc(doc(db, "users", partnerId), {
        partnerStatus: newStatus,
        isPartnerVerified: newStatus === "approved"
      });
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, partnerStatus: newStatus } : p));
      if (selectedPartner?.id === partnerId) {
        setSelectedPartner(prev => ({ ...prev, partnerStatus: newStatus }));
      }
    } catch (e) {
      alert("Failed to update status: " + (e?.message || "Please check Firestore rules"));
    } finally {
      setActionLoading(false);
    }
  };

  const pendingList = partners.filter(p => (p.partnerStatus || "pending") === "pending");
  const approvedList = partners.filter(p => p.partnerStatus === "approved");
  const rejectedList = partners.filter(p => p.partnerStatus === "rejected" || p.partnerStatus === "suspended");

  const displayedList = partners.filter(p => {
    const st = (p.partnerStatus || "pending").toLowerCase();
    if (activeTab === "pending" && st !== "pending") return false;
    if (activeTab === "approved" && st !== "approved") return false;
    if (activeTab === "rejected" && st !== "rejected" && st !== "suspended") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchShop = p.shopName?.toLowerCase().includes(q);
      const matchName = p.name?.toLowerCase().includes(q);
      const matchEmail = p.email?.toLowerCase().includes(q);
      const matchPhone = p.phone?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      return matchShop || matchName || matchEmail || matchPhone || matchCity;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
            Partner Onboarding &amp; Approvals
            {pendingList.length > 0 && (
              <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-500/30">
                {pendingList.length} Pending Approval
              </span>
            )}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review merchant registrations, verify store credentials, and grant partner catalog listing privileges.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPartners}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
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
            <span>Pending ({pendingList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "approved" ? "bg-emerald-700 text-white" : "text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved Partners ({approvedList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rejected")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === "rejected" ? "bg-rose-700 text-white" : "text-rose-800 hover:bg-rose-50"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Rejected / Inactive ({rejectedList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "all" ? "bg-[#3E0C15] text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            All Registrations ({partners.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by shop name, owner, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
          />
        </div>
      </div>

      {/* Main Partners Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-400">Loading partner applications...</div>
        ) : displayedList.length === 0 ? (
          <div className="p-16 text-center">
            <Store className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No partner applications found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? "No records match your search filter." : "There are currently no partner accounts in this view."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <th className="py-3 px-4 font-bold">Shop &amp; Seller</th>
                  <th className="py-3 px-4 font-bold">Contact Details</th>
                  <th className="py-3 px-4 font-bold">Location</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Products</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {displayedList.map((p) => {
                  const status = (p.partnerStatus || "pending").toLowerCase();
                  const isApproved = status === "approved";
                  const isRejected = status === "rejected";
                  const isPending = status === "pending";
                  const prodCount = productCounts[p.id] || 0;

                  return (
                    <tr 
                      key={p.id} 
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedPartner(p)}
                    >
                      {/* Shop Name & Owner */}
                      <td className="py-3.5 px-4 font-medium text-stone-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#571520]/10 border border-[#571520]/20 flex items-center justify-center text-[#571520] font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                            {(p.shopName?.[0] || "P").toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1 group-hover:text-[#571520] transition-colors">
                              {p.shopName || "Untitled Shop"}
                            </span>
                            <span className="text-[11px] text-stone-500 block">{p.name || "Owner"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-stone-600">
                        <span className="font-medium text-stone-800 block">{p.phone || "No phone"}</span>
                        <span className="text-[11px] text-stone-400 block truncate max-w-[170px]">{p.email}</span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-stone-600">
                        <span className="font-medium text-stone-800 block">{p.city || "—"}, {p.state || ""}</span>
                        {p.pincode && <span className="text-[10px] text-stone-400 font-mono block">PIN: {p.pincode}</span>}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-stone-600">
                        <span className="font-medium text-stone-800 block line-clamp-1">{p.categoryNiche || "General"}</span>
                        {p.gstNumber && p.gstNumber !== "Not Provided" && (
                          <span className="text-[10px] text-emerald-700 font-mono block">GST: {p.gstNumber}</span>
                        )}
                      </td>

                      {/* Products Count */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                          {prodCount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        ) : isRejected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold animate-pulse">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full KYC / Details Modal */}
                          <button
                            type="button"
                            onClick={() => setSelectedPartner(p)}
                            title="View Full Partner Details"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] border border-stone-300 shadow-2xs transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#571520]" />
                            <span>Review Details</span>
                          </button>

                          {/* Quick Approve Button */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => handleApprove(p.id, p.shopName)}
                              disabled={actionLoading}
                              title="Approve Partner"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Quick Reject Button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => setRejectionModal({ open: true, partnerId: p.id, reason: "" })}
                              disabled={actionLoading}
                              title="Reject Application"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Suspend Toggle for Approved */}
                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => handleSuspend(p.id, p.partnerStatus)}
                              disabled={actionLoading}
                              title="Suspend Access"
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Partner Full Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#3E0C15] via-[#571520] to-[#2A080C] text-white p-6 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-[#E8C574]/20 border border-[#E8C574]/40 flex items-center justify-center text-[#E8C574] font-serif font-bold text-2xl shrink-0">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-xl font-bold text-white">{selectedPartner.shopName || "Untitled Shop"}</h3>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px] tracking-wider ${
                      selectedPartner.partnerStatus === "approved" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
                      selectedPartner.partnerStatus === "rejected" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" :
                      "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}>
                      {selectedPartner.partnerStatus || "Pending Approval"}
                    </span>
                  </div>
                  <p className="text-xs text-[#E5D7BF] mt-0.5">
                    Owner: <strong>{selectedPartner.name || "—"}</strong> &bull; Registered on: {new Date(selectedPartner.createdAt || 0).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Category Badges */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-[#571520] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Authorized Business Categories</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  {(Array.isArray(selectedPartner.categories) && selectedPartner.categories.length > 0
                    ? selectedPartner.categories
                    : (selectedPartner.categoryNiche || "General Ethnic Wear").split(",").map(s => s.trim())
                  ).map((cat, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 shadow-2xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shop & Contact Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-[#571520] flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  <span>Shop Details &amp; Contact Info</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Owner / Contact Person</span>
                    <span className="font-bold text-stone-900 text-sm">{selectedPartner.name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Shop / Business Brand</span>
                    <span className="font-bold text-stone-900 text-sm">{selectedPartner.shopName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Phone Number</span>
                    <a href={`tel:${selectedPartner.phone}`} className="font-semibold text-blue-700 hover:underline flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{selectedPartner.phone || "—"}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Email Address</span>
                    <a href={`mailto:${selectedPartner.email}`} className="font-semibold text-blue-700 hover:underline flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{selectedPartner.email}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">GST Number</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block mt-0.5">
                      {selectedPartner.gstNumber || "Not Provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Location (City / State)</span>
                    <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{selectedPartner.city || "—"}, {selectedPartner.state || "—"} ({selectedPartner.pincode || "—"})</span>
                    </span>
                  </div>
                  <div className="sm:col-span-2 pt-1 border-t border-stone-200">
                    <span className="text-stone-400 block text-[10px]">Full Shop Address</span>
                    <span className="font-semibold text-stone-900 block mt-0.5">
                      {[selectedPartner.shopAddress, selectedPartner.city, selectedPartner.state, selectedPartner.pincode].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Settlement Bank Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-[#571520] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Settlement Bank &amp; Payout Account</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Account Holder Name</span>
                    <span className="font-bold text-stone-900">{selectedPartner.bankDetails?.accountHolder || selectedPartner.name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Bank Name</span>
                    <span className="font-bold text-stone-900">{selectedPartner.bankDetails?.bankName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Account Number</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block mt-0.5">
                      {selectedPartner.bankDetails?.accountNumber || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">IFSC Code</span>
                    <span className="font-mono font-bold text-stone-900 uppercase bg-white px-2 py-0.5 rounded border border-stone-200 inline-block mt-0.5">
                      {selectedPartner.bankDetails?.ifsc || "—"}
                    </span>
                  </div>
                  <div className="sm:col-span-2 pt-1 border-t border-amber-200/60">
                    <span className="text-stone-400 block text-[10px]">UPI ID for Instant Payouts</span>
                    <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-stone-200 inline-block mt-0.5">
                      {selectedPartner.bankDetails?.upiId || "Not Provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  {selectedPartner.partnerStatus !== "approved" && (
                    <button
                      type="button"
                      onClick={() => handleApprove(selectedPartner.id, selectedPartner.shopName)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve &amp; Activate Partner</span>
                    </button>
                  )}

                  {selectedPartner.partnerStatus === "pending" && (
                    <button
                      type="button"
                      onClick={() => {
                        setRejectionModal({ open: true, partnerId: selectedPartner.id, reason: "" });
                        setSelectedPartner(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Note Modal */}
      {rejectionModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-red-200 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Reject Partner Application</h3>
            <p className="text-xs text-stone-600">
              Provide a note explaining why this partner registration is being rejected:
            </p>
            <textarea
              rows={3}
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g. Incomplete store address or invalid phone number..."
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModal({ open: false, partnerId: null, reason: "" })}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
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
