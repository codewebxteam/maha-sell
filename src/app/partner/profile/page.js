"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Building2,
  AlertCircle
} from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function PartnerProfilePage() {
  const { user, shopName, partnerData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    name: "",
    phone: "",
    categoryNiche: "",
    shopAddress: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: ""
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setFormData({
            shopName: d.shopName || "",
            name: d.name || user.displayName || "",
            phone: d.phone || "",
            categoryNiche: d.categoryNiche || "Sarees & Traditional Wear",
            shopAddress: d.shopAddress || "",
            city: d.city || "",
            state: d.state || "",
            pincode: d.pincode || "",
            gstNumber: d.gstNumber || "",
            accountHolder: d.bankDetails?.accountHolder || d.accountHolder || "",
            bankName: d.bankDetails?.bankName || d.bankName || "",
            accountNumber: d.bankDetails?.accountNumber || d.accountNumber || "",
            ifsc: d.bankDetails?.ifsc || d.ifsc || "",
            upiId: d.bankDetails?.upiId || d.upiId || ""
          });
        }
      } catch (err) {
        console.warn("Error loading partner profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        shopName: formData.shopName.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        categoryNiche: formData.categoryNiche,
        shopAddress: formData.shopAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        gstNumber: formData.gstNumber.trim() || "Not Provided",
        bankDetails: {
          accountHolder: formData.accountHolder.trim(),
          bankName: formData.bankName.trim(),
          accountNumber: formData.accountNumber.trim(),
          ifsc: formData.ifsc.trim(),
          upiId: formData.upiId.trim()
        },
        updatedAt: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile: " + (err?.message || "Please try again"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-stone-400">Loading shop profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Store Profile &amp; Payout Settings</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage your shop branding and settlement bank account details</p>
        </div>

        {success && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Shop Info Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#3E0C15] pb-3 border-b border-stone-100">
            <Store className="w-4 h-4 text-[#C5832B]" />
            <h2>Shop &amp; Seller Branding</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Shop / Store Name *
              </label>
              <input
                type="text"
                required
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Displayed on website product cards as &quot;Sold by: {formData.shopName}&quot;.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Registered Login Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Shop Address / Market
            </label>
            <input
              type="text"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase"
            />
          </div>
        </div>

        {/* Bank & Payout Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#3E0C15] pb-3 border-b border-stone-100">
            <CreditCard className="w-4 h-4 text-[#C5832B]" />
            <h2>Bank Account &amp; Settlement Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              UPI ID (For rapid settlement)
            </label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3E0C15] hover:bg-[#571520] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{saving ? "Saving Changes..." : "Save Store Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
