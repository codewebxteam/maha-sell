"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Store, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Layers,
  FileText,
  Check,
  Clock,
  LogOut
} from "lucide-react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { doc, setDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { auth, db, firebaseConfig } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VastraLogo from "@/components/VastraLogo";

const DEFAULT_CATEGORIES = [
  { id: "cat-sarees", name: "Sarees & Ethnic", slug: "sarees-ethnic" },
  { id: "cat-women", name: "Women's Wear", slug: "womens-wear" },
  { id: "cat-men", name: "Men's Wear", slug: "mens-wear" },
  { id: "cat-kids", name: "Kids' Wear", slug: "kids-wear" },
  { id: "cat-footwear", name: "Footwear", slug: "footwear" }
];

export default function PartnerRegisterPage() {
  const router = useRouter();
  const { user: activeUser, logout: authLogout } = useAuth();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Admin Categories state for checkboxes
  const [adminCategories, setAdminCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner & Account
    name: "",
    email: "",
    password: "",
    phone: "",
    // Step 2: Shop & Business Info
    shopName: "",
    categoryNiche: "",
    shopAddress: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
    gstNumber: "",
    // Step 3: Payout Details
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Fetch admin created categories from Firestore
  useEffect(() => {
    async function fetchAdminCategories() {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cats.length > 0) {
          const unique = [];
          const seen = new Set();
          for (const c of cats) {
            const name = (c.name || "").trim();
            if (name && !seen.has(name.toLowerCase())) {
              seen.add(name.toLowerCase());
              unique.push({ id: c.id, name, slug: c.slug || c.id });
            }
          }
          setAdminCategories(unique);
          if (unique.length > 0) {
            setSelectedCategories([unique[0].name]);
          }
        } else {
          setAdminCategories(DEFAULT_CATEGORIES);
          setSelectedCategories([DEFAULT_CATEGORIES[0].name]);
        }
      } catch (e) {
        console.warn("Categories fetch note:", e);
        setAdminCategories(DEFAULT_CATEGORIES);
        setSelectedCategories([DEFAULT_CATEGORIES[0].name]);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchAdminCategories();
  }, []);

  const toggleCategory = (catName) => {
    setSelectedCategories(prev => {
      if (prev.includes(catName)) {
        return prev.filter(c => c !== catName);
      } else {
        return [...prev, catName];
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");

    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.phone.trim()) {
        setError("Please complete all required fields in Step 1.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.shopName.trim() || !formData.shopAddress.trim() || !formData.city.trim() || !formData.pincode.trim()) {
        setError("Please provide complete shop and address details.");
        return;
      }
      if (selectedCategories.length === 0) {
        setError("Please select at least one business category checkbox that your shop sells.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Initialize secondary Firebase app so registering a partner DOES NOT auto-login as customer or disturb active sessions
      const secondaryAppName = "PartnerRegistrationApp";
      let secondaryApp = getApps().find(app => app.name === secondaryAppName);
      if (!secondaryApp) {
        secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      }
      const secondaryAuth = getAuth(secondaryApp);
      const secondaryDb = getFirestore(secondaryApp);

      // 2. Create User account on secondary auth (primary auth session is NEVER touched!)
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email.trim(),
        formData.password
      );
      const user = userCredential.user;

      // 3. Update Auth display name
      await updateProfile(user, { displayName: formData.name.trim() });

      // 4. Save comprehensive partner profile to Firestore using secondaryDb
      const partnerPayload = {
        uid: user.uid,
        name: formData.name.trim(),
        email: user.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        shopName: formData.shopName.trim(),
        categoryNiche: selectedCategories.join(", "),
        categories: selectedCategories,
        shopAddress: formData.shopAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        gstNumber: formData.gstNumber.trim() || "Not Provided",
        bankDetails: {
          accountHolder: formData.accountHolder.trim() || formData.name.trim(),
          bankName: formData.bankName.trim() || "Not Provided",
          accountNumber: formData.accountNumber.trim() || "Not Provided",
          ifsc: formData.ifsc.trim() || "Not Provided",
          upiId: formData.upiId.trim() || "Not Provided"
        },
        role: "partner",
        partnerStatus: "pending", // Waiting for admin approval!
        isPartnerVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(secondaryDb, "users", user.uid), partnerPayload);

      // 5. Cleanly sign out secondary auth so no dangling auth state remains
      try {
        await signOut(secondaryAuth);
      } catch (_) {}

      // 6. Save submitted summary for confirmation screen
      setSubmittedData({
        ...partnerPayload,
        shopName: formData.shopName.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        categories: selectedCategories,
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      });

      // Show success screen without redirecting or auto-logging in!
      setIsSuccess(true);
    } catch (err) {
      console.error("Partner registration error:", err);
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError("This email address is already registered. Please log in instead.");
      } else if (code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Failed to submit partner application. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E8C574_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#571520]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#C5832B]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-[#E8C574]/40 overflow-hidden z-10 my-4">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#3E0C15] via-[#571520] to-[#2A080C] text-white pt-8 pb-7 px-6 sm:px-8 text-center relative">
          <div className="flex justify-between items-center mb-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#E8C574] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8C574] bg-[#E8C574]/15 px-2.5 py-1 rounded-full border border-[#E8C574]/30">
              Seller &amp; Partner Program
            </span>
          </div>

          <div className="flex justify-center mb-2">
            <VastraLogo variant="light" size="default" showTagline={false} />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7] tracking-wide mt-1">
            Register as a Maha Sell Partner
          </h1>
          <p className="text-xs sm:text-sm text-[#E5D7BF] mt-1.5 max-w-lg mx-auto leading-relaxed">
            Expand your business across India. List your products under your shop brand name with verified admin onboarding.
          </p>

          {/* Stepper Progress */}
          {isSuccess ? (
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-[#E8C574] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Application Status: Under Review (Admin Verification Pending)</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 sm:gap-6 mt-6 pt-5 border-t border-white/10 text-xs">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-[#E8C574] font-bold" : "text-stone-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 1 ? "bg-[#C5832B] text-stone-900" : "bg-stone-800 text-stone-400"
                }`}>
                  1
                </div>
                <span>Owner &amp; Login</span>
              </div>
              <div className="w-6 sm:w-12 h-0.5 bg-white/20" />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-[#E8C574] font-bold" : "text-stone-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 2 ? "bg-[#C5832B] text-stone-900" : "bg-stone-800 text-stone-400"
                }`}>
                  2
                </div>
                <span>Shop &amp; Address</span>
              </div>
              <div className="w-6 sm:w-12 h-0.5 bg-white/20" />
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-[#E8C574] font-bold" : "text-stone-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 3 ? "bg-[#C5832B] text-stone-900" : "bg-stone-800 text-stone-400"
                }`}>
                  3
                </div>
                <span>Payout Info</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Success Badge */}
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/10">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Partner Application Submitted!
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                  Aapki shop details safaltapoorvak receive ho gayi hain aur admin team ko verification ke liye bhej di gayi hain.
                </p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-full text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Status: Pending Admin Approval (समीक्षाधीन)</span>
                </div>
              </div>

              {/* Submitted Details Summary Card */}
              <div className="bg-[#FAF7F2] border border-stone-200 rounded-2xl p-4 sm:p-5 text-xs text-stone-800 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#3E0C15] border-b border-stone-200 pb-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#571520]" />
                  Application Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Shop / Business Name</span>
                    <span className="font-bold text-stone-900 text-sm">{submittedData?.shopName || formData.shopName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Contact Person Name</span>
                    <span className="font-bold text-stone-900">{submittedData?.name || formData.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Partner Login Email</span>
                    <span className="font-medium text-stone-800">{submittedData?.email || formData.email}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Contact Phone</span>
                    <span className="font-medium text-stone-800">{submittedData?.phone || formData.phone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 block text-[11px] mb-1">Selected Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(submittedData?.categories || selectedCategories).map((c, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-white border border-stone-200 rounded-md text-[11px] font-medium text-stone-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 block text-[11px]">Location</span>
                    <span className="text-stone-700 font-medium">
                      {(submittedData?.city || formData.city)}, {(submittedData?.state || formData.state)} - {(submittedData?.pincode || formData.pincode)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Verification Notice */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed space-y-1">
                    <p className="font-bold text-blue-950">Auto-Login Disabled During Review</p>
                    <p className="text-blue-800">
                      Suraksha aur verification compliance ke liye aapko automatic user ki tarah login nahi kiya gaya hai.
                      Jaise hi admin aapki application approve karega, aap apne registered email aur password se 
                      <strong> Partner Portal</strong> me login karke products list kar sakenge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold text-center transition-colors border border-stone-200"
                >
                  Back to Maha Sell Store
                </Link>
                <Link
                  href="/login"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#3E0C15] to-[#571520] hover:from-[#571520] hover:to-[#3E0C15] text-[#E8C574] rounded-xl text-xs font-bold text-center transition-all shadow-md shadow-[#3E0C15]/20 flex items-center justify-center gap-1.5"
                >
                  <span>Go to Partner Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setCurrentStep(1);
                    setSubmittedData(null);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors cursor-pointer"
                >
                  Register another shop / Naya partner register karein
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {activeUser && (
                <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">
                      Currently active session: <strong>{activeUser.email}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await authLogout();
                      } catch (_) {}
                    }}
                    className="text-[11px] font-bold text-[#3E0C15] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}

              {/* Step 1: Owner Details & Password */}
              {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#571520]" />
                  Owner / Contact Person Information
                </h2>
                <p className="text-xs text-stone-500">Provide the primary administrator details for this partner account.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="e.g. Ramesh Bhai Patel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Business Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                  placeholder="ramesh@sharmasarees.com"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">This email will be your Partner Portal login ID.</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3E0C15] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider hover:bg-[#571520] transition-colors cursor-pointer shadow-md"
                >
                  <span>Continue to Shop Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Shop & Business Info */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-1 flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#571520]" />
                  Shop Name &amp; Business Address
                </h2>
                <p className="text-xs text-stone-500">
                  This shop name will be displayed next to your verified products on the website (e.g. &quot;Sold by: Sharma Sarees&quot;).
                </p>
              </div>

              {/* Shop / Store Name */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Shop / Store Name *
                </label>
                <input
                  type="text"
                  name="shopName"
                  required
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                  placeholder="e.g. Surat Heritage Sarees"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Displayed on website product cards as &quot;Sold by: {formData.shopName || "Your Shop Name"}&quot;.
                </span>
              </div>

              {/* Primary Business Categories Checkboxes (From Admin Added Categories) */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3E0C15] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C5832B]" />
                    <span>Primary Business Categories (Select Checkboxes) *</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                    {selectedCategories.length} Selected
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Select the categories you want to sell products in. Categories are synced directly from the admin panel.
                </p>

                {loadingCats ? (
                  <div className="p-4 bg-white/70 rounded-xl text-xs text-stone-500 text-center">
                    Loading admin categories...
                  </div>
                ) : adminCategories.length === 0 ? (
                  <div className="p-4 bg-white/70 rounded-xl text-xs text-stone-500 text-center">
                    No categories found. Contact store admin.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {adminCategories.map((cat) => {
                      const isChecked = selectedCategories.includes(cat.name);
                      return (
                        <div
                          key={cat.id || cat.slug || cat.name}
                          onClick={() => toggleCategory(cat.name)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                            isChecked
                              ? "bg-white border-[#3E0C15] text-[#3E0C15] font-bold shadow-xs ring-1.5 ring-[#3E0C15]/20"
                              : "bg-white/80 border-stone-200 text-stone-700 hover:bg-white hover:border-stone-300"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                            isChecked
                              ? "bg-[#3E0C15] border-[#3E0C15] text-[#F3E5C8]"
                              : "border-stone-300 bg-stone-50"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Shop Street Address / Market *
                </label>
                <input
                  type="text"
                  name="shopAddress"
                  required
                  value={formData.shopAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                  placeholder="e.g. Chowk, Godowlia / Aminabad"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="Varanasi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="Uttar Pradesh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="221001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  GST Number (Optional)
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                  placeholder="24AAAAA0000A1Z5 (If applicable)"
                />
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3E0C15] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider hover:bg-[#571520] transition-colors cursor-pointer shadow-md"
                >
                  <span>Continue to Payout Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payout / Bank Details */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#571520]" />
                  Partner Payout &amp; Bank Details
                </h2>
                <p className="text-xs text-stone-500">
                  Where Maha Sell will transfer your product sales proceeds after the 15% platform commission settlement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder={formData.name || "e.g. Ramesh Bhai Patel"}
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="HDFC / SBI / ICICI"
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="50100029384729"
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
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                    placeholder="HDFC0001234"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  UPI ID (Optional for fast settlements)
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                  placeholder="ramesh@okhdfcbank"
                />
              </div>

              {/* Commission Policy notice */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-[#571520]">
                  <Sparkles className="w-4 h-4 text-[#C5832B]" />
                  Transparent 15% Platform Commission Policy
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Upon admin approval of your account, you can list products under authorized categories. Each product will be verified by Maha Sell Admin before going live with standard 15% commission (or admin approved rate).
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#571520] via-[#3E0C15] to-[#2A080C] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>{loading ? "Submitting Application..." : "Submit Partner Application"}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </form>
          )}

          {/* Already registered */}
          <div className="mt-8 pt-5 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-600">
              Already registered as a partner?{" "}
              <Link href="/login" className="font-bold text-[#3E0C15] hover:underline underline-offset-4">
                Sign into Partner Portal
              </Link>
            </p>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
