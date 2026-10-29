"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Tag, 
  ShieldCheck, 
  Image as ImageIcon,
  Trash2,
  X,
  Store,
  Percent,
  Layers,
  HelpCircle
} from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const DEFAULT_CATEGORIES = [
  { id: "cat-sarees", name: "Sarees & Ethnic", slug: "sarees-ethnic", type: "main" },
  { id: "cat-women", name: "Women's Wear", slug: "womens-wear", type: "main" },
  { id: "cat-men", name: "Men's Wear", slug: "mens-wear", type: "main" },
  { id: "cat-kids", name: "Kids' Wear", slug: "kids-wear", type: "main" },
  { id: "cat-footwear", name: "Footwear", slug: "footwear", type: "main" },
];

export default function PartnerNewProductPage() {
  const router = useRouter();
  const { user, shopName, partnerData } = useAuth();
  const currentShopName = shopName || partnerData?.shopName || "My Store";

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    categoryName: "",
    subcategory: "",
    subcategoryName: "",
    fabricName: "Pure Silk",
    colorName: "",
    price: "", // Partner base price
    originalPrice: "", // MRP
    stock: "10",
    length: "5.5 Meters",
    description: "",
    images: [],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

  useEffect(() => {
    async function fetchStoreCategories() {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cats.length > 0) {
          setCategories(cats);
          // Set first category as default
          const mainCats = cats.filter(c => c.type === "main" || !c.type);
          if (mainCats.length > 0) {
            setFormData(prev => ({
              ...prev,
              category: mainCats[0].slug || mainCats[0].id,
              categoryName: mainCats[0].name
            }));
          }
        } else {
          setCategories(DEFAULT_CATEGORIES);
          setFormData(prev => ({
            ...prev,
            category: DEFAULT_CATEGORIES[0].slug,
            categoryName: DEFAULT_CATEGORIES[0].name
          }));
        }
      } catch (e) {
        console.warn("Categories fetch warning:", e);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoadingCats(false);
      }
    }
    fetchStoreCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleCategorySelect = (e) => {
    const selectedSlug = e.target.value;
    const foundCat = categories.find(c => (c.slug || c.id) === selectedSlug);
    setFormData(prev => ({
      ...prev,
      category: selectedSlug,
      categoryName: foundCat ? foundCat.name : selectedSlug,
      subcategory: "",
      subcategoryName: ""
    }));
  };

  const handleSubcategorySelect = (e) => {
    const selectedSlug = e.target.value;
    const foundSub = categories.find(c => (c.slug || c.id) === selectedSlug);
    setFormData(prev => ({
      ...prev,
      subcategory: selectedSlug,
      subcategoryName: foundSub ? foundSub.name : selectedSlug
    }));
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput("");
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleUploadSuccess = (res) => {
    if (res && res.url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, res.url]
      }));
    }
  };

  const mainCategories = categories.filter(c => c.type === "main" || !c.type || !c.parentCategory);
  const subCategories = categories.filter(c => c.type === "sub" || c.parentCategory === formData.category);

  // Commission calculations
  const basePriceNum = Number(formData.price) || 0;
  const standardCommission = Math.round(basePriceNum * 0.15); // 15% automatic
  const estimatedSellingPrice = basePriceNum + standardCommission;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a product title.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid asking price.");
      return;
    }
    if (formData.images.length === 0) {
      alert("Please add at least one product photo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalSlug = `${formData.slug || "item"}-${Date.now().toString().slice(-5)}`;

      const productPayload = {
        name: formData.name.trim(),
        slug: finalSlug,
        category: formData.category,
        categoryName: formData.categoryName || formData.category,
        subcategory: formData.subcategory || "",
        subcategoryName: formData.subcategoryName || "",
        fabricName: formData.fabricName || "Pure Silk",
        colorName: formData.colorName || "Multi",
        // Partner Pricing & Platform Commission Info
        partnerBasePrice: Number(formData.price),
        price: estimatedSellingPrice, // Initial estimate, admin can finalize
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(estimatedSellingPrice * 1.5),
        commissionPercent: 15, // 15% default automatic
        stock: Number(formData.stock) || 10,
        length: formData.length || "Standard",
        description: formData.description || "",
        images: formData.images,
        // Seller Information
        sellerId: user.uid,
        sellerShopName: currentShopName,
        sellerName: user.displayName || partnerData?.name || "Partner",
        sellerEmail: user.email,
        sellerPhone: partnerData?.phone || "",
        // Verification workflow (Pending admin review)
        isVerified: false,
        verificationStatus: "pending", // "pending" | "approved" | "rejected"
        status: "pending_verification",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, "products"), productPayload);

      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/partner/products");
      }, 1500);
    } catch (err) {
      console.error("Error creating partner product:", err);
      alert("Failed to submit product: " + (err?.message || "Please check Firestore rules"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/partner/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Products</span>
        </Link>

        {successMessage && (
          <div className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Product submitted for Admin Verification!</span>
          </div>
        )}
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9B111E] to-[#C5832B] flex items-center justify-center text-white shadow-xs font-serif font-bold text-lg">
              <Store className="w-5 h-5 text-[#FAF7F2]" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-stone-900">List New Partner Product</h1>
              <p className="text-xs text-stone-500">
                Selling under shop: <strong className="text-stone-800">{currentShopName}</strong>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Category Selection - Strictly Existing Categories Only */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800">
              <Layers className="w-4 h-4 text-[#571520]" />
              <h3>Category Selection (Existing Store Categories Only)</h3>
            </div>
            <p className="text-xs text-stone-600">
              Choose the category where this product belongs. You can only list in categories already verified by Maha Sell.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Main Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={handleCategorySelect}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                >
                  {mainCategories.map(cat => (
                    <option key={cat.id} value={cat.slug || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Subcategory (Optional)
                </label>
                <select
                  value={formData.subcategory}
                  onChange={handleSubcategorySelect}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                >
                  <option value="">General / All Subcategories</option>
                  {subCategories.map(sub => (
                    <option key={sub.id} value={sub.slug || sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Product Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Royal Maroon Kanjivaram Pure Silk Saree with Zari Border"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Fabric / Material
                </label>
                <input
                  type="text"
                  value={formData.fabricName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fabricName: e.target.value }))}
                  placeholder="Pure Silk / Cotton / Georgette"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Primary Color
                </label>
                <input
                  type="text"
                  value={formData.colorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorName: e.target.value }))}
                  placeholder="e.g. Crimson Red, Peacock Blue"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Available Stock *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Description &amp; Highlights
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe weave, zari work, styling tips, occasion suitability, and blouse piece details..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* 3. Pricing & 15% Automatic Platform Commission Preview */}
          <div className="bg-[#FAF7F2] border border-[#3E251A]/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3E0C15] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#C5832B]" />
                Partner Pricing &amp; Commission Breakdown
              </span>
              <span className="text-[10px] font-bold bg-[#571520] text-[#F3E5C8] px-2 py-0.5 rounded-full">
                15% Standard Verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Your Net Asking Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 1200"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Amount you receive per unit sold (before taxes/shipping).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Original MRP (₹) (Optional)
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  placeholder="e.g. 2999"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E0C15]"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Printed MRP for cross-out discount display on website.
                </span>
              </div>
            </div>

            {/* Live Calculation Preview */}
            {basePriceNum > 0 && (
              <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs text-stone-800 space-y-2">
                <span className="font-bold text-stone-900 block text-xs">Estimated Listing Calculation:</span>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Your Base Asking Price:</span>
                  <span className="font-bold text-stone-900">₹{basePriceNum.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Platform Commission (15% automatic):</span>
                  <span className="font-bold text-[#571520]">+₹{standardCommission.toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-bold text-[#3E0C15] text-sm">
                  <span>Estimated Customer Selling Price:</span>
                  <span>₹{estimatedSellingPrice.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[10px] text-stone-400 italic">
                  Note: The Admin can adjust the final commission rate or selling price during verification before publishing to the live store.
                </p>
              </div>
            )}
          </div>

          {/* 4. Product Photos */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Product Images (Upload or paste URLs) *
            </label>

            {/* Direct URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-900"
              >
                Add URL
              </button>
            </div>

            {/* ImageKit Direct Upload */}
            <div className="p-3 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-xs text-stone-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-stone-400" />
                <span>Or upload file directly from your computer:</span>
              </div>
              <IKContext
                publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "public_key"}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io"}
                authenticator={authenticator}
              >
                <IKUpload
                  fileName={`partner_${Date.now()}`}
                  onError={(err) => console.warn("Upload error:", err)}
                  onSuccess={handleUploadSuccess}
                  className="text-xs text-stone-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3E0C15] file:text-white hover:file:bg-[#571520] cursor-pointer"
                />
              </IKContext>
            </div>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-[9px] text-white font-bold">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
            <Link
              href="/partner/products"
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#571520] via-[#3E0C15] to-[#2A080C] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? "Submitting for Verification..." : "Submit Product for Verification"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
